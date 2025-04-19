import { useEffect, useState } from 'react';
import { Brain, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
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

    const toggleTooltip = (id: string) => (event: React.MouseEvent) => {
      event.stopPropagation();
      setActiveTooltip(activeTooltip === id ? null : id);
    };

    return (
      <div className="mt-6 mb-8 space-y-6">
        {/* Progress Bar and Metrics */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Epoch</span>
              <div className="relative inline-block">
                <button 
                  onClick={toggleTooltip('epoch')}
                  className="tooltip-trigger text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <HelpCircle size={14} />
                </button>
                {activeTooltip === 'epoch' && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg z-10 w-64 text-left whitespace-normal shadow-lg">
                    One round of training where the model goes through the same data to learn.
                  </div>
                )}
              </div>
            </div>
            <span>Epoch {currentEpoch + 1} of 50</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Loss</span>
                <div className="relative inline-block">
                  <button 
                    onClick={toggleTooltip('loss')}
                    className="tooltip-trigger text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <HelpCircle size={14} />
                  </button>
                  {activeTooltip === 'loss' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg z-10 w-64 text-left whitespace-normal shadow-lg">
                      A number showing how far the model's predictions are from the correct answers on the same data.
                    </div>
                  )}
                </div>
              </div>
              <span className="font-medium">{metrics.loss.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Accuracy</span>
                <div className="relative inline-block">
                  <button 
                    onClick={toggleTooltip('accuracy')}
                    className="tooltip-trigger text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <HelpCircle size={14} />
                  </button>
                  {activeTooltip === 'accuracy' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg z-10 w-64 text-left whitespace-normal shadow-lg">
                      The percentage of correct predictions, but only on the same data the model was trained on.
                    </div>
                  )}
                </div>
              </div>
              <span className="font-medium">{(metrics.accuracy * 100).toFixed(1)}%</span>
            </div>
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
          <p className="text-gray-600">Loading TensorFlow.js model...</p>
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
                <span className="font-medium text-gray-700">Note about retraining:</span> If you add, remove, or change any images in your groups, you'll need to retrain the model for those changes to take effect.
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
            Train your model to recognize the classes you've created.
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