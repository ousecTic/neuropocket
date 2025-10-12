import * as tf from '@tensorflow/tfjs';
import {
  MOBILE_NET_INPUT_WIDTH,
  MOBILE_NET_INPUT_HEIGHT
} from '../constants';

/**
 * Apply data augmentation to an image tensor
 * Randomly applies transformations to increase training data variety
 */
export const augmentImage = (imageTensor: tf.Tensor3D): tf.Tensor3D => {
  return tf.tidy(() => {
    let augmented = imageTensor;
    
    // Random horizontal flip (50% chance)
    if (Math.random() > 0.5) {
      // Add batch dimension for flipLeftRight, then remove it
      const batched = augmented.expandDims(0) as tf.Tensor4D;
      const flipped = tf.image.flipLeftRight(batched);
      augmented = flipped.squeeze([0]) as tf.Tensor3D;
    }
    
    // Random brightness adjustment (-10% to +10%)
    const brightnessDelta = (Math.random() - 0.5) * 0.2;
    const brightnessMultiplier = 1 + brightnessDelta;
    augmented = augmented.mul(brightnessMultiplier) as tf.Tensor3D;
    
    // Random contrast adjustment (0.8 to 1.2)
    const contrastFactor = 0.8 + Math.random() * 0.4;
    const mean = augmented.mean();
    augmented = augmented.sub(mean).mul(contrastFactor).add(mean) as tf.Tensor3D;
    
    // Clip values to valid range [0, 1]
    augmented = augmented.clipByValue(0, 1) as tf.Tensor3D;
    
    return augmented;
  });
};

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
 * Applies data augmentation for small datasets to improve accuracy
 */
export const prepareTrainingData = async (
  mobilenet: tf.GraphModel,
  classes: { name: string; images: string[] }[]
) => {
  const features: tf.Tensor[] = [];
  const labels: number[] = [];

  try {
    // Calculate total images to determine if augmentation is needed
    const totalImages = classes.reduce((sum, c) => sum + c.images.length, 0);
    const useAugmentation = totalImages < 50; // Use augmentation for small datasets
    const augmentationsPerImage = useAugmentation ? 3 : 1; // Create 3 augmented versions per image
    
    console.log(`Dataset size: ${totalImages} images. Augmentation: ${useAugmentation ? 'ENABLED' : 'DISABLED'}`);
    
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

        // Extract the 3D tensor (remove batch dimension)
        const imageTensor3D = processedImage.squeeze([0]) as tf.Tensor3D;
        
        // Create original + augmented versions
        for (let aug = 0; aug < augmentationsPerImage; aug++) {
          const imageToProcess = aug === 0 ? imageTensor3D : augmentImage(imageTensor3D);
          
          const feature = tf.tidy(() => {
            const batched = imageToProcess.expandDims(0);
            return mobilenet.predict(batched) as tf.Tensor;
          });

          features.push(feature);
          labels.push(i);
          
          // Clean up augmented tensor (but not the original)
          if (aug > 0) {
            imageToProcess.dispose();
          }
        }
        
        imageTensor3D.dispose();
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
