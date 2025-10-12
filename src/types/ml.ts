import * as tf from '@tensorflow/tfjs';

export interface MLState {
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

export interface MLActions {
  loadModel: () => Promise<boolean>;
  trainModel: (projectId: string, classes: { name: string; images: string[] }[]) => Promise<boolean>;
  predict: (imageData: string) => Promise<{ className: string; probability: number } | null>;
  resetTrainingState: () => void;
  dispose: () => void;
}

export type MLStore = MLState & MLActions;
