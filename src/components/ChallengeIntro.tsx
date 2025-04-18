import { Brain, Target } from 'lucide-react';

interface ChallengeIntroProps {
  onDismiss: () => void;
}

export function ChallengeIntro({ onDismiss }: ChallengeIntroProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-6">
          <div className="bg-blue-50 rounded-full p-3 flex-shrink-0">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Welcome to the AI Bias Challenge!</h2>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Train a model to distinguish between apples and pears. Select your training images carefully - 
                the test results might surprise you!
              </p>

              <div className="flex items-start gap-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
                <Target className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Objective</p>
                  <p className="text-sm">Create a model that can accurately identify both apples and pears in any situation.</p>
                </div>
              </div>

              <div className="space-y-2">
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Select training images</li>
                  <li>Train your model</li>
                  <li>Test and see the results</li>
                </ol>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
