import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as tf from '@tensorflow/tfjs';
import {
  MOBILE_NET_INPUT_WIDTH,
  MOBILE_NET_INPUT_HEIGHT,
  TRAINING_EPOCHS,
  BATCH_SIZE
} from '../constants';

interface MLState {
  mobilenet: tf.GraphModel | null;
  model: tf.Sequential | null;
  classNames: string[];
  isTraining: boolean;
  isTrained: boolean;
  trainingProgress: {
    epoch: number;
    loss: number;
    accuracy: number;
  } | null;
  currentProjectId: string | null;
}

interface MLActions {
  loadModel: () => Promise<boolean>;
  trainModel: (projectId: string, classes: { name: string; images: string[] }[]) => Promise<boolean>;
  predict: (imageData: string) => Promise<{ className: string; probability: number } | null>;
  resetTrainingState: () => void;
  dispose: () => void;
}

type MLStore = MLState & MLActions;

// Helper function to process images
const processImage = async (imageData: string): Promise<tf.Tensor | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const tensor = tf.tidy(() => {
        const canvas = document.createElement('canvas');
        canvas.width = MOBILE_NET_INPUT_WIDTH;
        canvas.height = MOBILE_NET_INPUT_HEIGHT;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, MOBILE_NET_INPUT_WIDTH, MOBILE_NET_INPUT_HEIGHT);
        
        const imageTensor = tf.browser.fromPixels(canvas);
        return imageTensor.toFloat().div(255).expandDims(0);
      });
      resolve(tensor);
    };
    img.onerror = () => resolve(null);
    img.src = imageData;
  });
};

// Helper function to prepare training data
const prepareTrainingData = async (
  mobilenet: tf.GraphModel,
  classes: { name: string; images: string[] }[]
) => {
  const features: tf.Tensor[] = [];
  const labels: number[] = [];

  try {
    // Process each class
    for (let i = 0; i < classes.length; i++) {
      const classData = classes[i];
      console.log(`Processing class ${classData.name} (${classData.images.length} images)...`);
      
      // Process each image in the class
      for (const imageData of classData.images) {
        const processedImage = await processImage(imageData);
        if (!processedImage) {
          console.error(`Failed to process image for class ${classData.name}`);
          continue;
        }

        const feature = tf.tidy(() => {
          return mobilenet.predict(processedImage) as tf.Tensor;
        });

        features.push(feature);
        labels.push(i);
        processedImage.dispose();
      }
    }

    if (features.length === 0) {
      console.error('No valid features extracted from images');
      return null;
    }

    console.log(`Total features extracted: ${features.length}`);

    // Concatenate all features and create one-hot encoded labels
    const xs = tf.concat(features);
    const ys = tf.oneHot(labels, classes.length);

    // Clean up individual tensors
    features.forEach(f => f.dispose());

    return { xs, ys };
  } catch (error) {
    console.error('Error preparing training data:', error);
    features.forEach(f => f.dispose());
    return null;
  }
};

export const useMLStore = create<MLStore>()(
  persist(
    (set, get) => ({
      mobilenet: null,
      model: null,
      classNames: [],
      isTraining: false,
      isTrained: false,
      trainingProgress: null,
      currentProjectId: null,

      loadModel: async () => {
        if (get().mobilenet) return true;

        try {
          const modelUrl = './model/model.json';
          const mobilenet = await tf.loadGraphModel(modelUrl);
          
          // Warmup the model
          tf.tidy(() => {
            const dummyInput = tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]);
            const warmupResult = mobilenet.predict(dummyInput) as tf.Tensor;
            console.log('Feature shape:', warmupResult.shape);
            warmupResult.dispose();
          });
          
          set({ mobilenet });
          return true;
        } catch (error) {
          console.error('Error loading MobileNet:', error);
          return false;
        }
      },

      trainModel: async (projectId, classes) => {
        const { mobilenet, isTraining, model } = get();
        if (isTraining || !mobilenet) return false;

        try {
          // Validate input data
          if (!classes || classes.length < 2) {
            console.error('Need at least 2 classes for training');
            return false;
          }

          for (const classData of classes) {
            if (!classData.images || classData.images.length === 0) {
              console.error(`No images provided for class ${classData.name}`);
              return false;
            }
          }

          console.log('Starting training with classes:', classes.map(c => ({ name: c.name, imageCount: c.images.length })));

          set({ 
            isTraining: true, 
            trainingProgress: null,
            currentProjectId: projectId,
            isTrained: false
          });

          // Dispose previous model if exists
          if (model) {
            model.dispose();
          }

          // Store class names for prediction
          const classNames = classes.map(c => c.name);

          // Get the feature shape from MobileNet
          const dummyInput = tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]);
          const dummyOutput = mobilenet.predict(dummyInput) as tf.Tensor;
          const featureShape = dummyOutput.shape[1] as number;
          console.log('Feature shape:', featureShape);
          dummyOutput.dispose();
          dummyInput.dispose();

          // Create a new sequential model with correct input shape
          const newModel = tf.sequential({
            layers: [
              tf.layers.dense({
                inputShape: [featureShape],
                units: 128,
                activation: 'relu'
              }),
              tf.layers.dropout({ rate: 0.5 }),
              tf.layers.dense({
                units: classes.length,
                activation: 'softmax'
              })
            ]
          });

          // Compile the model
          newModel.compile({
            optimizer: tf.train.adam(0.0001),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
          });

          // Prepare training data
          console.log('Preparing training data...');
          const processedData = await prepareTrainingData(mobilenet, classes);
          if (!processedData) {
            console.error('Failed to prepare training data');
            set({ isTraining: false });
            return false;
          }

          const { xs, ys } = processedData;
          console.log('Training data prepared:', {
            features: xs.shape,
            labels: ys.shape,
            classNames
          });

          // Train the model
          console.log('Starting model training...');
          await newModel.fit(xs, ys, {
            epochs: TRAINING_EPOCHS,
            batchSize: BATCH_SIZE,
            validationSplit: 0.2,
            callbacks: {
              onEpochEnd: (epoch, logs) => {
                if (logs) {
                  console.log(`Epoch ${epoch + 1}/${TRAINING_EPOCHS}:`, logs);
                  set({
                    trainingProgress: {
                      epoch,
                      loss: logs.loss,
                      accuracy: logs.acc
                    }
                  });
                }
              }
            }
          });

          // Clean up training tensors
          xs.dispose();
          ys.dispose();

          console.log('Training completed successfully');
          set({ 
            model: newModel,
            classNames,
            isTrained: true,
            isTraining: false
          });
          return true;
        } catch (error) {
          console.error('Error during training:', error);
          set({ isTraining: false });
          return false;
        }
      },

      predict: async (imageData) => {
        const { mobilenet, model, classNames, isTrained } = get();
        if (!mobilenet || !model || !isTrained || classNames.length === 0) return null;

        const processedImage = await processImage(imageData);
        if (!processedImage) return null;

        try {
          const result = tf.tidy(() => {
            const features = mobilenet.predict(processedImage) as tf.Tensor;
            const prediction = model.predict(features) as tf.Tensor;
            return prediction.dataSync();
          });

          const maxProbability = Math.max(...result);
          const classIndex = result.indexOf(maxProbability);

          return {
            className: classNames[classIndex],
            probability: maxProbability
          };
        } catch (error) {
          console.error('Error making prediction:', error);
          return null;
        } finally {
          processedImage.dispose();
        }
      },

      resetTrainingState: () => {
        const { model } = get();
        if (model) {
          model.dispose();
        }
        set({
          model: null,
          classNames: [],
          isTraining: false,
          isTrained: false,
          trainingProgress: null,
          currentProjectId: null
        });
      },

      dispose: () => {
        const { model } = get();
        if (model) {
          model.dispose();
        }
        set({
          model: null,
          classNames: []
        });
      }
    }),
    {
      name: 'ml-store',
      partialize: (state) => ({
        currentProjectId: state.currentProjectId
      }),
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
              localStorage.removeItem(name);
              console.warn('Storage quota exceeded. ML store data has been cleared.');
            }
          }
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);