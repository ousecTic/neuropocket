import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as tf from '@tensorflow/tfjs';
import {
  MOBILE_NET_INPUT_WIDTH,
  MOBILE_NET_INPUT_HEIGHT,
  TRAINING_EPOCHS,
  BATCH_SIZE
} from '../constants';
import { processImage, prepareTrainingData } from './mlHelpers';

interface TrainingSnapshot {
  classNames: string[];
  imageCounts: number[];
  totalImages: number;
}

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
  trainingSnapshot: TrainingSnapshot | null;
}

interface MLActions {
  loadModel: () => Promise<boolean>;
  trainModel: (projectId: string, classes: { name: string; images: string[] }[]) => Promise<boolean>;
  predict: (imageData: string) => Promise<{ className: string; probability: number } | null>;
  resetTrainingState: () => void;
  dispose: () => void;
  hasDataChanged: (classes: { name: string; images: string[] }[]) => boolean;
}

type MLStore = MLState & MLActions;

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
      trainingSnapshot: null,

      loadModel: async () => {
        if (get().mobilenet) return true;

        try {
          const modelUrl = './model/model.json';
          const mobilenet = await tf.loadGraphModel(modelUrl);
          
          // Warmup the model
          tf.tidy(() => {
            const dummyInput = tf.zeros([1, MOBILE_NET_INPUT_WIDTH, MOBILE_NET_INPUT_HEIGHT, 3]);
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
          const dummyInput = tf.zeros([1, MOBILE_NET_INPUT_WIDTH, MOBILE_NET_INPUT_HEIGHT, 3]);
          const dummyOutput = mobilenet.predict(dummyInput) as tf.Tensor;
          const featureShape = dummyOutput.shape[1] as number;
          console.log('Feature shape:', featureShape);
          dummyOutput.dispose();
          dummyInput.dispose();

          // Calculate total training samples for adaptive architecture
          const totalImages = classes.reduce((sum, c) => sum + c.images.length, 0);
          
          // Adaptive model architecture based on dataset size
          // Larger datasets get more complex models, smaller datasets get simpler ones
          const hiddenUnits1 = Math.min(256, Math.max(128, totalImages * 4));
          const hiddenUnits2 = Math.floor(hiddenUnits1 / 2);
          const dropoutRate = totalImages < 50 ? 0.3 : 0.5; // Lower dropout for small datasets
          const learningRate = totalImages < 20 ? 0.001 : 0.0001; // Higher LR for small datasets
          
          console.log(`Model architecture: [${featureShape}] -> [${hiddenUnits1}] -> [${hiddenUnits2}] -> [${classes.length}]`);
          console.log(`Dropout rate: ${dropoutRate}, Learning rate: ${learningRate}`);

          // Create a deeper sequential model with adaptive architecture
          const newModel = tf.sequential({
            layers: [
              // First hidden layer
              tf.layers.dense({
                inputShape: [featureShape],
                units: hiddenUnits1,
                activation: 'relu',
                kernelInitializer: 'heNormal'
              }),

              tf.layers.dropout({ rate: dropoutRate }),
              
              // Second hidden layer
              tf.layers.dense({
                units: hiddenUnits2,
                activation: 'relu',
                kernelInitializer: 'heNormal'
              }),
              tf.layers.dropout({ rate: dropoutRate * 0.5 }),
              
              // Output layer
              tf.layers.dense({
                units: classes.length,
                activation: 'softmax'
              })
            ]
          });

          // Compile the model with adaptive learning rate
          newModel.compile({
            optimizer: tf.train.adam(learningRate),
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

          // Determine validation split based on dataset size
          // For small datasets (< 10 images per class), use all data for training
          // to avoid the issue where validation split leaves no training data
          const minImagesPerClass = Math.min(...classes.map(c => c.images.length));
          const useValidationSplit = minImagesPerClass >= 10;
          const validationSplit = useValidationSplit ? 0.2 : 0.0;
          
          console.log(`Using validation split: ${validationSplit} (min images per class: ${minImagesPerClass})`);

          // Train the model
          console.log('Starting model training...');
          await newModel.fit(xs, ys, {
            epochs: TRAINING_EPOCHS,
            batchSize: BATCH_SIZE,
            validationSplit,
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
          
          // Create training snapshot
          const snapshot: TrainingSnapshot = {
            classNames: classes.map(c => c.name),
            imageCounts: classes.map(c => c.images.length),
            totalImages
          };
          
          set({ 
            model: newModel,
            classNames,
            isTrained: true,
            isTraining: false,
            trainingSnapshot: snapshot
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
          currentProjectId: null,
          trainingSnapshot: null
        });
      },

      hasDataChanged: (classes) => {
        const { trainingSnapshot, currentProjectId } = get();
        
        // If no snapshot exists, data hasn't "changed" - it's just not trained
        if (!trainingSnapshot || !currentProjectId) return false;
        
        // Check if number of classes changed
        if (classes.length !== trainingSnapshot.classNames.length) return true;
        
        // Check if class names changed
        const currentClassNames = classes.map(c => c.name).sort();
        const snapshotClassNames = [...trainingSnapshot.classNames].sort();
        if (JSON.stringify(currentClassNames) !== JSON.stringify(snapshotClassNames)) return true;
        
        // Check if image counts changed for any class
        const currentImageCounts = classes.map(c => c.images.length);
        const totalCurrentImages = currentImageCounts.reduce((sum, count) => sum + count, 0);
        
        if (totalCurrentImages !== trainingSnapshot.totalImages) return true;
        
        // Check individual class image counts (match by name)
        for (let i = 0; i < classes.length; i++) {
          const className = classes[i].name;
          const snapshotIndex = trainingSnapshot.classNames.indexOf(className);
          if (snapshotIndex === -1) return true; // Class not in snapshot
          if (classes[i].images.length !== trainingSnapshot.imageCounts[snapshotIndex]) return true;
        }
        
        return false;
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