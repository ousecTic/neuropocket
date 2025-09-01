import { useEffect, useState } from 'react';
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
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeTooltip && !(event.target as Element).closest('.tooltip-trigger')) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeTooltip]);

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

    // Require at least one image per class
    const emptyClasses = project.classes.filter(c => c.images.length === 0);
    if (emptyClasses.length > 0) {
      setError(`Each group must have at least one image to train the model. Please add images to: ${emptyClasses.map(c => c.name).join(', ')}`);
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
  const canTrain = hasMinimumClasses && project.classes.length > 0;

  const renderTrainingMetrics = () => {
    const metrics = trainingProgress;
    if (!metrics) return null;

    const currentEpoch = metrics.epoch;
    const progress = ((currentEpoch + 1) / 50) * 100;


    return (
      <div className="mt-6 mb-8 space-y-6">
        {/* Progress Bar and Metrics */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Rounds of Training</span>
            <span>Round {currentEpoch + 1} of 50</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  if (!isModelLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isTrained && currentProjectId === project.id) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Model Trained Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your model is ready to use. Go to the <span className="font-semibold text-gray-800">Model tab</span> to test it out.
            </p>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 mb-6">
              <p>
                <span className="font-medium text-gray-700">Important:</span> If you add or remove images in the Data tab, click "Retrain Model" for your AI to recognize the updates.
              </p>
            </div>
          </div>

          {renderTrainingMetrics()}

          {(!canTrain || error) && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div className="text-red-600 text-sm text-left">
                {!hasMinimumClasses && (
                  <p className="mb-1">Need at least 2 groups to train the model.</p>
                )}
                {error && <p>{error}</p>}
              </div>
            </div>
          )}

          <button
            onClick={handleTrainModel}
            disabled={!canTrain}
            className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors ${
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
        <div className="text-center mb-6">
          <Brain size={48} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Train Your Model</h2>
          <p className="text-gray-600">
            Train your model to recognize the groups you've created.
          </p>
        </div>

        {(!canTrain || error) && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div className="text-red-600 text-sm text-left">
              {!hasMinimumClasses && (
                <p className="mb-1">Need at least 2 groups to train the model.</p>
              )}
              {error && <p>{error}</p>}
            </div>
          </div>
        )}

        <button
          onClick={handleTrainModel}
          disabled={!canTrain || isTraining}
          className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors ${
            canTrain && !isTraining
              ? 'hover:bg-blue-700' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isTraining ? 'Training...' : 'Train Model'}
        </button>

        {renderTrainingMetrics()}
      </div>
    </div>
  );
}