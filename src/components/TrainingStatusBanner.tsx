import { useMLStore } from '../store/useMLStore';
import Brain from 'lucide-react/dist/esm/icons/brain';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

interface TrainingStatusBannerProps {
  projectId: string;
  classes: { name: string; images: string[] }[];
  currentTab: 'data' | 'training' | 'model';
  onGoToData?: () => void;
  onGoToTraining?: () => void;
  onGoToModel?: () => void;
}

export function TrainingStatusBanner({ projectId, classes, currentTab, onGoToData, onGoToTraining, onGoToModel }: TrainingStatusBannerProps) {
  const { isTrained, currentProjectId, hasDataChanged, trainingSnapshot, isTraining } = useMLStore();
  
  const isProjectTrained = isTrained && currentProjectId === projectId;
  const dataHasChanged = isProjectTrained && hasDataChanged(classes);
  const isCurrentlyTraining = isTraining && currentProjectId === projectId;
  
  // Data validation
  const hasMinimumClasses = classes.length >= 2;
  const allClassesHaveImages = classes.every(c => c.images.length > 0);
  const isDataReady = hasMinimumClasses && allClassesHaveImages;
  const totalImages = classes.reduce((sum, c) => sum + c.images.length, 0);
  
  // === DATA TAB MESSAGES ===
  if (currentTab === 'data') {
    // Not enough classes
    if (!hasMinimumClasses) {
      return (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Add at Least 2 Groups</h4>
              <p className="text-sm text-gray-700">
                Create groups for different categories you want your AI to recognize.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Not enough images
    if (!allClassesHaveImages) {
      return (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Add Images to Your Groups</h4>
              <p className="text-sm text-gray-700">
                Each group needs at least one image before you can train.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Data ready but not trained
    if (!isProjectTrained) {
      return (
        <div className="bg-green-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">Data Ready!</h4>
              <p className="text-sm text-green-700">
                You have {classes.length} groups with {totalImages} {totalImages === 1 ? 'image' : 'images'}. Ready to train when you are.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Trained but data changed
    if (dataHasChanged) {
      return (
        <div className="bg-amber-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">Data Changed</h4>
              <p className="text-sm text-amber-700">
                You changed your images. Go to the{' '}
                {onGoToTraining ? (
                  <button 
                    onClick={onGoToTraining}
                    className="font-semibold text-amber-900 hover:text-amber-950 underline cursor-pointer"
                  >
                    Training tab
                  </button>
                ) : (
                  <span className="font-semibold">Training tab</span>
                )}
                {' '}to retrain your AI.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Trained and up-to-date
    return (
      <div className="bg-green-50 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">Your AI is Ready!</h4>
            <p className="text-sm text-green-700">
              It analyzed {trainingSnapshot?.totalImages || 0} {(trainingSnapshot?.totalImages || 0) === 1 ? 'picture' : 'pictures'}. Your AI is up-to-date.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // === TRAINING TAB MESSAGES ===
  if (currentTab === 'training') {
    // Training in progress
    if (isCurrentlyTraining) {
      return (
        <div className="bg-blue-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">Training Your AI...</h4>
              <p className="text-sm text-blue-700">
                Your AI is analyzing the images and finding patterns. This may take a minute.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Data not ready
    if (!isDataReady) {
      return (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Add Data First</h4>
              <p className="text-sm text-gray-700">
                Go to the{' '}
                {onGoToData ? (
                  <button 
                    onClick={onGoToData}
                    className="font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    Data tab
                  </button>
                ) : (
                  <span className="font-semibold">Data tab</span>
                )}
                {' '}to add images to your groups before training.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Data changed - needs retraining
    if (dataHasChanged) {
      return (
        <div className="bg-amber-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">Your AI Needs to Be Retrained</h4>
              <p className="text-sm text-amber-700">
                You changed your images. Click{' '}
                <span className="font-semibold text-amber-900">"Retrain Model"</span>
                {' '}below to analyze the new pictures.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Trained and ready
    if (isProjectTrained) {
      return (
        <div className="bg-green-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">Your AI is Ready!</h4>
              <p className="text-sm text-green-700">
                It analyzed {trainingSnapshot?.totalImages || 0} {(trainingSnapshot?.totalImages || 0) === 1 ? 'picture' : 'pictures'}. Go to the{' '}
                {onGoToModel ? (
                  <button 
                    onClick={onGoToModel}
                    className="font-semibold text-green-900 hover:text-green-950 underline cursor-pointer"
                  >
                    Model tab
                  </button>
                ) : (
                  <span className="font-semibold">Model tab</span>
                )}
                {' '}to test it.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Ready to train
    return (
      <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Ready to Train Your AI</h4>
            <p className="text-sm text-gray-700">
              Train your AI to recognize your groups.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // === MODEL TAB MESSAGES ===
  if (currentTab === 'model') {
    // Not trained yet
    if (!isProjectTrained) {
      return (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Train Your AI First</h4>
              <p className="text-sm text-gray-700">
                Go to the{' '}
                {onGoToTraining ? (
                  <button 
                    onClick={onGoToTraining}
                    className="font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    Training tab
                  </button>
                ) : (
                  <span className="font-semibold">Training tab</span>
                )}
                {' '}to train your AI before testing.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Data changed - needs retraining
    if (dataHasChanged) {
      return (
        <div className="bg-amber-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">Your AI Needs to Be Retrained</h4>
              <p className="text-sm text-amber-700">
                You changed your images.{' '}
                {onGoToTraining ? (
                  <button 
                    onClick={onGoToTraining}
                    className="font-semibold text-amber-900 hover:text-amber-950 underline cursor-pointer"
                  >
                    Retrain your AI
                  </button>
                ) : (
                  <span className="font-semibold">Retrain your AI</span>
                )}
                {' '}for accurate results.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Trained and ready to test
    return (
      <div className="bg-green-50 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">Your AI is Ready!</h4>
            <p className="text-sm text-green-700">
              Test your AI with new images to see how well it recognizes your groups.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback (shouldn't reach here)
  return null;
}
