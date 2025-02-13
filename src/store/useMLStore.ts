import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mlService } from '../services/ml';

interface MLState {
  isModelLoaded: boolean;
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
  loadModel: () => Promise<void>;
  trainModel: (projectId: string, classes: { name: string; images: string[] }[]) => Promise<boolean>;
  predict: (imageData: string) => Promise<{ className: string; probability: number } | null>;
  resetTrainingState: () => void;
}

type MLStore = MLState & MLActions;

export const useMLStore = create<MLStore>()(
  persist(
    (set, get) => ({
      isModelLoaded: false,
      isTraining: false,
      isTrained: false,
      trainingProgress: null,
      currentProjectId: null,

      loadModel: async () => {
        if (!get().isModelLoaded) {
          const success = await mlService.loadMobileNet();
          set({ isModelLoaded: success });
        }
      },

      trainModel: async (projectId, classes) => {
        if (!get().isModelLoaded || get().isTraining) return false;

        // Map classes to include their names
        const trainingClasses = classes.map((c) => ({
          name: c.name,
          images: c.images
        }));

        set({ 
          isTraining: true, 
          trainingProgress: null,
          currentProjectId: projectId,
          isTrained: false
        });

        try {
          const success = await mlService.trainModel(trainingClasses, (epoch, logs) => {
            set({
              trainingProgress: {
                epoch,
                loss: logs.loss,
                accuracy: logs.acc
              }
            });
          });

          if (success) {
            set({ isTrained: true });
          }

          return success;
        } catch (error) {
          console.error('Training error:', error);
          return false;
        } finally {
          set({ isTraining: false });
        }
      },

      predict: async (imageData) => {
        if (!get().isModelLoaded || !get().isTrained) return null;
        return mlService.predict(imageData);
      },

      resetTrainingState: () => {
        set({
          isTraining: false,
          isTrained: false,
          trainingProgress: null,
          currentProjectId: null
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