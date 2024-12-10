import React, { useEffect, useState } from 'react';
import { Brain, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMLStore } from '../store/useMLStore';
import { Project } from '../types/project';

interface TrainingSectionProps {
  project: Project;
}

export function TrainingSection({ project }: TrainingSectionProps) {
  const { 
    isModelLoaded, 
    isTraining, 
    isTrained,
    trainingProgress, 
    currentProjectId,
    loadModel, 
    trainModel,
    resetTrainingState 
  } = useMLStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  // Reset training state if switching projects
  useEffect(() => {
    if (currentProjectId && currentProjectId !== project.id) {
      resetTrainingState();
    }
  }, [currentProjectId, project.id, resetTrainingState]);

  const handleTrainModel = async () => {
    setError(null);

    // Validate classes have enough images
    const invalidClasses = project.classes.filter(c => c.images.length < 5);
    if (invalidClasses.length > 0) {
      setError(`Each class needs at least 5 images. Add more images to: ${invalidClasses.map(c => c.name).join(', ')}`);
      return;
    }

    // Format classes for training
    const trainingClasses = project.classes.map(c => ({
      name: c.name,
      images: c.images.map(img => img.dataUrl)
    }));

    const success = await trainModel(project.id, trainingClasses);
    if (!success) {
      setError('Training failed. Please try again.');
    }
  };

  // Check if all requirements are met
  const hasMinimumClasses = project.classes.length >= 2;
  const classesWithMinimumImages = project.classes.filter(c => c.images.length >= 5);
  const hasMinimumImages = classesWithMinimumImages.length === project.classes.length && project.classes.length > 0;
  const canTrain = hasMinimumClasses && hasMinimumImages;

  if (!isModelLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TensorFlow.js model...</p>
        </div>
      </div>
    );
  }

  if (isTrained && currentProjectId === project.id) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Model Trained Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your model is ready to use. Go to the Preview tab to test it out.
          </p>

          {!canTrain && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <p className="text-amber-600 text-sm text-left">
                {!hasMinimumClasses 
                  ? "Need at least 2 classes to retrain the model"
                  : "Each class needs at least 5 images to retrain the model"}
              </p>
            </div>
          )}

          <button
            onClick={handleTrainModel}
            disabled={!canTrain}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors ${
              canTrain 
                ? 'hover:bg-blue-700' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Retrain Model
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="max-w-md mx-auto">
        {!isTraining ? (
          <div className="text-center">
            <Brain size={48} className="mx-auto text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Train Your Model</h2>
            <p className="text-gray-600 mb-6">
              Train your model to recognize different classes based on the images you've collected
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <p className="text-red-600 text-sm text-left">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Training Requirements:</h3>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${hasMinimumClasses ? 'bg-green-500' : 'bg-gray-300'}`} />
                    At least 2 classes ({project.classes.length} available)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${hasMinimumImages ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Minimum 5 images per class {project.classes.length > 0 && `(${classesWithMinimumImages.length}/${project.classes.length} classes ready)`}
                  </li>
                </ul>
              </div>

              <button
                onClick={handleTrainModel}
                disabled={!canTrain}
                className={`w-full px-6 py-3 rounded-lg transition-colors ${
                  canTrain
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Start Training
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Training in Progress</h2>
              <p className="text-gray-600">
                Please don't close the browser window
              </p>
            </div>

            {trainingProgress && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((trainingProgress.epoch / 50) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(trainingProgress.epoch / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Loss</p>
                      <p className="font-medium">{trainingProgress.loss.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Accuracy</p>
                      <p className="font-medium">{(trainingProgress.accuracy * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}