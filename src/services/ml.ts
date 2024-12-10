import * as tf from '@tensorflow/tfjs';

const MOBILE_NET_INPUT_WIDTH = 128;
const MOBILE_NET_INPUT_HEIGHT = 128;
const TRAINING_EPOCHS = 50;
const BATCH_SIZE = 32;

export class MLService {
  private mobilenet: tf.GraphModel | null = null;
  private model: tf.Sequential | null = null;
  private isTraining = false;

  async loadMobileNet() {
    if (this.mobilenet) return true;

    try {
      const modelUrl = '/model/model.json';
      this.mobilenet = await tf.loadGraphModel(modelUrl);
      
      // Warmup the model
      tf.tidy(() => {
        const dummyInput = tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]);
        const warmupResult = this.mobilenet!.predict(dummyInput) as tf.Tensor;
        console.log('Feature shape:', warmupResult.shape);
        warmupResult.dispose();
      });
      
      return true;
    } catch (error) {
      console.error('Error loading MobileNet:', error);
      return false;
    }
  }

  async processImage(imageData: string): Promise<tf.Tensor | null> {
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
  }

  async trainModel(classes: { name: string; images: string[] }[], onProgress?: (epoch: number, logs: tf.Logs) => void) {
    if (this.isTraining || !this.mobilenet) return false;
    this.isTraining = true;

    try {
      // Dispose previous model if exists
      this.model?.dispose();

      // Get the feature shape from MobileNet
      const dummyInput = tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]);
      const dummyOutput = this.mobilenet.predict(dummyInput) as tf.Tensor;
      const featureShape = dummyOutput.shape[1] as number; // Get the feature dimension
      dummyOutput.dispose();
      dummyInput.dispose();

      // Create a new sequential model with correct input shape
      this.model = tf.sequential({
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
      this.model.compile({
        optimizer: tf.train.adam(0.0001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      // Prepare training data
      const processedData = await this.prepareTrainingData(classes);
      if (!processedData) {
        throw new Error('Failed to prepare training data');
      }

      const { xs, ys } = processedData;

      // Train the model
      await this.model.fit(xs, ys, {
        epochs: TRAINING_EPOCHS,
        batchSize: BATCH_SIZE,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (logs) {
              onProgress?.(epoch, logs);
            }
          }
        }
      });

      // Clean up
      xs.dispose();
      ys.dispose();

      return true;
    } catch (error) {
      console.error('Error training model:', error);
      return false;
    } finally {
      this.isTraining = false;
    }
  }

  private async prepareTrainingData(classes: { name: string; images: string[] }[]) {
    if (!this.mobilenet) return null;

    const features: tf.Tensor[] = [];
    const labels: number[] = [];

    try {
      // Process each class
      for (let i = 0; i < classes.length; i++) {
        const classData = classes[i];
        
        // Process each image in the class
        for (const imageData of classData.images) {
          const processedImage = await this.processImage(imageData);
          if (!processedImage) continue;

          const feature = tf.tidy(() => {
            return this.mobilenet!.predict(processedImage) as tf.Tensor;
          });

          features.push(feature);
          labels.push(i);
          processedImage.dispose();
        }
      }

      if (features.length === 0) return null;

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
  }

  async predict(imageData: string): Promise<{ className: string; probability: number } | null> {
    if (!this.mobilenet || !this.model) return null;

    const processedImage = await this.processImage(imageData);
    if (!processedImage) return null;

    try {
      const result = tf.tidy(() => {
        const features = this.mobilenet!.predict(processedImage) as tf.Tensor;
        const prediction = this.model!.predict(features) as tf.Tensor;
        return prediction.dataSync();
      });

      const maxProbability = Math.max(...result);
      const classIndex = result.indexOf(maxProbability);

      return {
        className: classIndex.toString(),
        probability: maxProbability
      };
    } catch (error) {
      console.error('Error making prediction:', error);
      return null;
    } finally {
      processedImage.dispose();
    }
  }

  dispose() {
    this.mobilenet?.dispose();
    this.model?.dispose();
  }
}

// Create a singleton instance
export const mlService = new MLService();