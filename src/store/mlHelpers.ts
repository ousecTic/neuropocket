import * as tf from '@tensorflow/tfjs';
import {
  MOBILE_NET_INPUT_WIDTH,
  MOBILE_NET_INPUT_HEIGHT
} from '../constants';

/**
 * Process an image for ML model input
 * Converts image to tensor with proper dimensions and normalization
 */
export const processImage = async (imageData: string): Promise<tf.Tensor | null> => {
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

/**
 * Prepare training data by extracting features from images
 * Returns tensors for features (xs) and labels (ys)
 */
export const prepareTrainingData = async (
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
