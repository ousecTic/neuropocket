import { useState, useEffect } from 'react';
import { ProjectHeader } from '../components/ProjectHeader';
import { useMLStore } from '../store/useMLStore';
import { ChallengeIntro } from '../components/ChallengeIntro';
import { CheckCircle2, Brain } from 'lucide-react';

type ChallengeType = 'bears-vs-dogs' | 'apples-vs-pears';

interface ImageItem {
  id: string;
  name: string;
  type: string;
  src: string;
  selected: boolean;
}

interface TestResult {
  imageName: string;
  expected: string;
  predicted: string;
  confidence: number;
}

export function Challenge() {
  const { mobilenet, isTraining, isTrained, trainingProgress, currentProjectId, loadModel, trainModel, predict } = useMLStore();
  const [challengeType, setChallengeType] = useState<ChallengeType>('bears-vs-dogs');
  const [selectedClass1, setSelectedClass1] = useState<string[]>([]);
  const [selectedClass2, setSelectedClass2] = useState<string[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  
  // Use different project IDs for each challenge type
  const challengeProjectId = `challenge-${challengeType}`;
  
  // Check if the current challenge specifically has been trained
  const isChallengeTrained = isTrained && currentProjectId === challengeProjectId;
  const [trainingResult, setTrainingResult] = useState<{
    finalLoss: number;
    finalAccuracy: number;
    totalEpochs: number;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [validationImages, setValidationImages] = useState<{ name: string; src: string }[]>([]);
  const [activeSection, setActiveSection] = useState<'data' | 'training' | 'testing'>('data');

  useEffect(() => {
    const initModel = async () => {
      setError(null);
      try {
        const success = await loadModel();
        if (!success) {
          setError('Failed to load the model. Please refresh the page and try again.');
        }
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load the model. Please refresh the page and try again.');
      }
    };

    initModel();
  }, [loadModel]);

  // Load images when challenge type changes
  useEffect(() => {
    const importImages = async () => {
      try {
        let loadedImages: ImageItem[] = [];
        let validationImageData: { name: string; src: string }[] = [];

        if (challengeType === 'bears-vs-dogs') {
          // Define bear images
          const bearImageNames = [
            'bear-1', 'bear-2', 'bear-3', 'bear-4', 'bear-5', 'bear-6', 'bear-7', 'bear-8', 'bear-9', 'bear-10',
            'bear-11', 'bear-12', 'bear-13', 'bear-14', 'bear-15', 'bear-16', 'bear-17', 'bear-18', 'bear-19', 'bear-20'
          ];

          // Define dog images
          const dogImageNames = [
            'dog-1', 'dog-2', 'dog-3', 'dog-4', 'dog-5', 'dog-6', 'dog-7', 'dog-8', 'dog-9', 'dog-10',
            'dog-11', 'dog-12', 'dog-13', 'dog-14', 'dog-15', 'dog-16', 'dog-17', 'dog-18', 'dog-19', 'dog-20'
          ];

          loadedImages = [
            ...bearImageNames.map(id => ({
              id,
              name: `Bear ${id.replace('bear-', '')}`,
              type: 'bear',
              src: `./challenge/bears-vs-dogs/bears/${id}.jpg`,
              selected: false
            })),
            ...dogImageNames.map(id => ({
              id,
              name: `Dog ${id.replace('dog-', '')}`,
              type: 'dog',
              src: `./challenge/bears-vs-dogs/dogs/${id}.jpg`,
              selected: false
            }))
          ];

          validationImageData = [
            { name: 'bear-validation-1', src: './challenge/bears-vs-dogs/validation/bear-validation-1.jpg' },
            { name: 'bear-validation-2', src: './challenge/bears-vs-dogs/validation/bear-validation-2.jpg' },
            { name: 'dog-validation-1', src: './challenge/bears-vs-dogs/validation/dog-validation-1.jpg' },
            { name: 'dog-validation-2', src: './challenge/bears-vs-dogs/validation/dog-validation-2.jpg' }
          ];
        } else {
          // Define apple images
          const appleImageNames = [
            'apple-1', 'apple-2', 'apple-3', 'apple-4', 'apple-5', 'apple-6', 'apple-7', 'apple-8', 'apple-9', 'apple-10',
            'apple-11', 'apple-12', 'apple-13', 'apple-14', 'apple-15', 'apple-16', 'apple-17', 'apple-18', 'apple-19', 'apple-20',
            'apple-21', 'apple-22', 'apple-23', 'apple-24', 'apple-25', 'apple-26', 'apple-27', 'apple-28', 'apple-29'
          ];

          // Define pear images
          const pearImageNames = [
            'pear-1', 'pear-2', 'pear-3', 'pear-4', 'pear-5', 'pear-6', 'pear-7', 'pear-8', 'pear-9', 'pear-10',
            'pear-11', 'pear-12', 'pear-14', 'pear-15', 'pear-16', 'pear-17', 'pear-18', 'pear-19', 'pear-20',
            'pear-21', 'pear-22', 'pear-23', 'pear-24', 'pear-25', 'pear-26', 'pear-27', 'pear-28', 'pear-29', 'pear-30'
          ];

          loadedImages = [
            ...appleImageNames.map(id => ({
              id,
              name: `Apple ${id.replace('apple-', '')}`,
              type: 'apple',
              src: `./challenge/apples-vs-pears/apples/${id}.jpg`,
              selected: false
            })),
            ...pearImageNames.map(id => ({
              id,
              name: `Pear ${id.replace('pear-', '')}`,
              type: 'pear',
              src: `./challenge/apples-vs-pears/pears/${id}.jpg`,
              selected: false
            }))
          ];

          validationImageData = [
            { name: 'apple-validation-1', src: './challenge/apples-vs-pears/validation/apple-validation-1.jpg' },
            { name: 'apple-validation-2', src: './challenge/apples-vs-pears/validation/apple-validation-2.jpg' },
            { name: 'pear-validation-1', src: './challenge/apples-vs-pears/validation/pear-validation-1.jpg' },
            { name: 'pear-validation-2', src: './challenge/apples-vs-pears/validation/pear-validation-2.jpg' }
          ];
        }
        
        setImages(loadedImages);
        setValidationImages(validationImageData);
        // Reset all state when changing challenge type
        setSelectedClass1([]);
        setSelectedClass2([]);
        setTestResults([]);
        setTrainingResult(null);
        setActiveSection('data');
      } catch (error) {
        console.error('Error loading images:', error);
        setError('Failed to load challenge images. Please refresh the page and try again.');
      }
    };

    importImages();
  }, [challengeType]);

  // Get class types based on challenge
  const getClassTypes = () => {
    if (challengeType === 'bears-vs-dogs') {
      return { class1: 'bear', class2: 'dog', class1Name: 'Bears', class2Name: 'Dogs' };
    }
    return { class1: 'apple', class2: 'pear', class1Name: 'Apples', class2Name: 'Pears' };
  };

  const classTypes = getClassTypes();

  const handleImageSelect = (image: ImageItem) => {
    if (image.type === classTypes.class1) {
      if (selectedClass1.includes(image.id)) {
        setSelectedClass1(prev => prev.filter(id => id !== image.id));
      } else if (selectedClass1.length < 10) {
        setSelectedClass1(prev => [...prev, image.id]);
      }
    } else {
      if (selectedClass2.includes(image.id)) {
        setSelectedClass2(prev => prev.filter(id => id !== image.id));
      } else if (selectedClass2.length < 10) {
        setSelectedClass2(prev => [...prev, image.id]);
      }
    }
  };

  const handleStartTraining = async () => {
    if (!mobilenet) {
      setError('Model is not loaded yet. Please wait.');
      return;
    }

    if (selectedClass1.length === 0 || selectedClass2.length === 0) {
      setError('Please select at least one image for each category.');
      return;
    }

    setError(null);

    // Get the selected images
    const class1Images = selectedClass1
      .map(id => images.find(img => img.id === id))
      .filter((img): img is ImageItem => img !== undefined);

    const class2Images = selectedClass2
      .map(id => images.find(img => img.id === id))
      .filter((img): img is ImageItem => img !== undefined);

    // Validate we have images for both classes
    if (class1Images.length === 0 || class2Images.length === 0) {
      setError('Failed to prepare training data. Please try selecting different images.');
      return;
    }

    console.log('Training data:', {
      class1: class1Images.length,
      class2: class2Images.length
    });

    // Prepare training data
    const classes = [
      {
        name: classTypes.class1Name.slice(0, -1), // Remove 's' to get singular
        images: class1Images.map(img => img.src)
      },
      {
        name: classTypes.class2Name.slice(0, -1), // Remove 's' to get singular
        images: class2Images.map(img => img.src)
      }
    ];

    console.log('Training with classes:', classes);

    try {
      const success = await trainModel(challengeProjectId, classes);

      if (success) {
        // Get final training progress from store
        const finalProgress = useMLStore.getState().trainingProgress;
        if (finalProgress) {
          setTrainingResult({
            finalLoss: finalProgress.loss,
            finalAccuracy: finalProgress.accuracy,
            totalEpochs: finalProgress.epoch + 1
          });
        }
        setError(null);
      } else {
        setError('Training failed. Please try again with different images.');
        setTrainingResult(null);
      }
    } catch (err) {
      console.error('Training error:', err);
      setError('An error occurred during training. Please try again with different images.');
      setTrainingResult(null);
    }
  };

  const handleStartTesting = async () => {
    if (!isChallengeTrained) {
      setError('Please train the model first before testing.');
      return;
    }

    setIsTesting(true);
    setTestResults([]);
    setError(null);

    try {
      // Test each validation image
      for (const image of validationImages) {
        const prediction = await predict(image.src);
        if (!prediction) {
          throw new Error(`Failed to get prediction for ${image.name}`);
        }

        // Determine expected class based on image name
        const expected = image.name.toLowerCase().includes(classTypes.class1.toLowerCase()) 
          ? classTypes.class1Name.slice(0, -1) 
          : classTypes.class2Name.slice(0, -1);

        // Add test result
        setTestResults(prev => [...prev, {
          imageName: image.name,
          expected,
          predicted: prediction.className,
          confidence: prediction.probability
        }]);
      }
    } catch (err) {
      console.error('Testing error:', err);
      setError('An error occurred during testing. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  // Check if data selection is complete
  const isDataComplete = selectedClass1.length > 0 && selectedClass2.length > 0;
  
  // Check if training is complete
  const isTrainingComplete = isChallengeTrained && trainingResult;

  // Show loading screen while model is loading
  if (!mobilenet) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <Brain className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-xl font-medium text-gray-700">Loading AI Model...</p>
          <p className="mt-2 text-sm text-gray-500">This may take a few seconds on first load</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ProjectHeader 
        title="AI Bias Challenge" 
        backTo="/"
        customContent={
          <select
            id="dataset-select"
            value={challengeType}
            onChange={(e) => setChallengeType(e.target.value as ChallengeType)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="bears-vs-dogs">Bears vs Dogs (Black & White)</option>
            <option value="apples-vs-pears">Apples vs Pears (Color)</option>
          </select>
        }
      />

      {showIntro ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <ChallengeIntro 
            onDismiss={() => setShowIntro(false)} 
            challengeType={challengeType}
          />
        </div>
      ) : (
        <>
          {/* Section Tabs */}
          <div className="bg-white shadow-sm sticky top-0 z-30 border-b">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <nav className="flex gap-8">
                <button
                  onClick={() => setActiveSection('data')}
                  className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                    activeSection === 'data'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  1. Data
                </button>
                <button
                  onClick={() => setActiveSection('training')}
                  disabled={!isDataComplete}
                  className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                    activeSection === 'training'
                      ? 'border-blue-600 text-blue-600'
                      : !isDataComplete
                        ? 'border-transparent text-gray-300 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  2. Training
                </button>
                <button
                  onClick={() => setActiveSection('testing')}
                  disabled={!isTrainingComplete}
                  className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                    activeSection === 'testing'
                      ? 'border-blue-600 text-blue-600'
                      : !isTrainingComplete
                        ? 'border-transparent text-gray-300 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  3. Model
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
                {error}
              </div>
            )}

            {activeSection === 'data' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Class 1 Section */}
                  <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-800">{classTypes.class1Name}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          Selected: {selectedClass1.length}/10
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto" style={{ 
                      minHeight: '200px', 
                      maxHeight: '400px',
                      WebkitOverflowScrolling: 'touch'
                    }}>
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
                        {images
                          .filter(img => img.type === classTypes.class1)
                          .map(image => (
                            <div
                              key={image.id}
                              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
                                selectedClass1.includes(image.id)
                                  ? 'border-blue-500 shadow-lg'
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                              onClick={() => handleImageSelect(image)}
                            >
                              <img
                                src={image.src}
                                alt={classTypes.class1Name}
                                className="w-full h-full object-cover"
                              />
                              {selectedClass1.includes(image.id) && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-10">
                                  <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Class 2 Section */}
                  <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-800">{classTypes.class2Name}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          Selected: {selectedClass2.length}/10
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto" style={{ 
                      minHeight: '200px', 
                      maxHeight: '400px',
                      WebkitOverflowScrolling: 'touch'
                    }}>
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
                        {images
                          .filter(img => img.type === classTypes.class2)
                          .map(image => (
                            <div
                              key={image.id}
                              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
                                selectedClass2.includes(image.id)
                                  ? 'border-blue-500 shadow-lg'
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                              onClick={() => handleImageSelect(image)}
                            >
                              <img
                                src={image.src}
                                alt={classTypes.class2Name}
                                className="w-full h-full object-cover"
                              />
                              {selectedClass2.includes(image.id) && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-10">
                                  <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">
                      Select up to 10 images for each category. Click an image to select/deselect it.
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-6">
                  <button
                    onClick={() => isDataComplete && setActiveSection('training')}
                    disabled={!isDataComplete}
                    className={`w-full px-6 py-3 rounded-lg font-medium text-white ${
                      isDataComplete
                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isDataComplete ? 'Continue to Training →' : 'Select images from both categories'}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'training' && (
              <>
                {!mobilenet ? (
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="max-w-md mx-auto text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  </div>
                ) : isChallengeTrained ? (
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
                            <span className="font-medium text-gray-700">Important:</span> If you change your image selection in the Data tab, click "Retrain Model" for your AI to recognize the updates.
                          </p>
                        </div>
                      </div>

                      {/* Training Metrics - only show if training the challenge */}
                      {trainingProgress && currentProjectId === challengeProjectId && (
                        <div className="mt-6 mb-8 space-y-6">
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Rounds of Training</span>
                              <span>Round {trainingProgress.epoch + 1} of 50</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${((trainingProgress.epoch + 1) / 50) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Error Display */}
                      {(selectedClass1.length === 0 || selectedClass2.length === 0) && (
                        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                          <svg className="text-red-600 shrink-0 mt-0.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div className="text-red-600 text-sm text-left">
                            <p>Need at least one image from each category to train the model.</p>
                          </div>
                        </div>
                      )}

                      {/* Continue to Model Button */}
                      <button
                        onClick={() => setActiveSection('testing')}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors hover:bg-blue-700 font-medium"
                      >
                        Continue to Model Testing →
                      </button>

                      <button
                        onClick={handleStartTraining}
                        disabled={selectedClass1.length === 0 || selectedClass2.length === 0}
                        className={`w-full mt-4 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg transition-colors ${
                          selectedClass1.length > 0 && selectedClass2.length > 0
                            ? 'hover:bg-blue-50' 
                            : 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400'
                        }`}
                      >
                        Retrain Model
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="max-w-md mx-auto">
                      <div className="text-center mb-6">
                        <Brain size={48} className="mx-auto text-blue-600 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Train Your Model</h2>
                        <p className="text-gray-600">
                          Train your model to recognize the categories you've selected.
                        </p>
                      </div>

                      {/* Error Display */}
                      {(selectedClass1.length === 0 || selectedClass2.length === 0) && (
                        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                          <svg className="text-red-600 shrink-0 mt-0.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div className="text-red-600 text-sm text-left">
                            <p>Need at least one image from each category to train the model.</p>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleStartTraining}
                        disabled={selectedClass1.length === 0 || selectedClass2.length === 0 || isTraining}
                        className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors ${
                          selectedClass1.length > 0 && selectedClass2.length > 0 && !isTraining
                            ? 'hover:bg-blue-700' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {isTraining ? 'Training...' : 'Train Model'}
                      </button>

                      {/* Training Metrics */}
                      {trainingProgress && currentProjectId === challengeProjectId && (
                        <div className="mt-6 mb-8 space-y-6">
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Rounds of Training</span>
                              <span>Round {trainingProgress.epoch + 1} of 50</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${((trainingProgress.epoch + 1) / 50) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeSection === 'testing' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                {!isChallengeTrained ? (
                  <p className="text-gray-600 text-center">
                    Train your model first before testing.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {/* Test Button */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={handleStartTesting}
                        disabled={isTesting || !isChallengeTrained}
                        className={`w-full max-w-md px-8 py-3 rounded-lg font-medium text-white ${
                          isTesting || !isChallengeTrained
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isTesting ? 'Running Tests...' : 'Run All Tests'}
                      </button>
                    </div>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="space-y-4">
                        {/* Desktop View */}
                        <div className="hidden md:block border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
                              {/* Header */}
                              <div className="grid grid-cols-6 gap-4 p-3 font-medium bg-gray-50">
                                <div>Test Case</div>
                                <div>Image</div>
                                <div>Expected</div>
                                <div>Predicted</div>
                                <div>Confidence in Prediction</div>
                                <div>Result</div>
                              </div>

                              {/* Test Cases */}
                              {testResults.map((result, index) => (
                                <div 
                                  key={result.imageName}
                                  className={`grid grid-cols-6 gap-4 p-3 items-center ${
                                    index < testResults.length - 1 ? 'border-b' : ''
                                  } ${
                                    result.expected === result.predicted 
                                      ? 'bg-green-50' 
                                      : 'bg-red-50'
                                  }`}
                                >
                                  <div>
                                    Test {index + 1}
                                  </div>
                                  <div>
                                    <img 
                                      src={validationImages.find(img => img.name === result.imageName)?.src} 
                                      alt={result.imageName}
                                      className="w-16 h-16 object-cover rounded"
                                    />
                                  </div>
                                  <div className="text-sm">
                                    {result.expected}
                                  </div>
                                  <div className={`text-sm font-medium ${
                                    result.expected === result.predicted 
                                      ? 'text-green-600' 
                                      : 'text-red-600'
                                  }`}>
                                    {result.predicted}
                                  </div>
                                  <div className="text-sm">
                                    <div className="flex flex-col">
                                      <span>Model is</span>
                                      <span className="font-medium">{(result.confidence * 100).toFixed(1)}% confident</span>
                                      <span>this is a {result.predicted}</span>
                                    </div>
                                  </div>
                                  <div>
                                    {result.expected === result.predicted ? (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="ml-1 font-medium">Correct</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-red-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-1 font-medium">Wrong</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Mobile View - Card Layout */}
                        <div className="md:hidden space-y-4">
                          {testResults.map((result, index) => (
                            <div 
                              key={result.imageName}
                              className={`p-4 rounded-lg ${
                                result.expected === result.predicted 
                                  ? 'bg-green-50' 
                                  : 'bg-red-50'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span className="font-medium">Test {index + 1}</span>
                                {result.expected === result.predicted ? (
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="ml-1 font-medium">Correct</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-1 font-medium">Wrong</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-4 mb-3">
                                <img 
                                  src={validationImages.find(img => img.name === result.imageName)?.src} 
                                  alt={result.imageName}
                                  className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1 space-y-2">
                                  <div>
                                    <span className="text-sm text-gray-600">Expected:</span>
                                    <div className="font-medium">{result.expected}</div>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600">Predicted:</span>
                                    <div className={`font-medium ${
                                      result.expected === result.predicted 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                    }`}>
                                      {result.predicted}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="text-sm text-gray-600">
                                Model is <span className="font-medium">{(result.confidence * 100).toFixed(1)}% confident</span> this is a {result.predicted}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Summary - Updated for better mobile display */}
                        <div className={`p-4 rounded-lg ${
                          testResults.every(r => r.expected === r.predicted) 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-50 text-gray-700'
                        }`}>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span className="font-medium">Summary:</span>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  Passed: {testResults.filter(r => r.expected === r.predicted).length}/{testResults.length}
                                </span>
                                <span>
                                  ({((testResults.filter(r => r.expected === r.predicted).length / testResults.length) * 100).toFixed(1)}%)
                                </span>
                              </div>
                              {testResults.every(r => r.expected === r.predicted) && (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 space-y-3">
                          {!testResults.every(r => r.expected === r.predicted) && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-4">
                                Not all tests passed. Try selecting different training images to improve your model.
                              </p>
                              <button
                                onClick={() => setActiveSection('data')}
                                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors hover:bg-blue-600 font-medium"
                              >
                                ← Go Back to Data
                              </button>
                            </div>
                          )}
                          
                          {testResults.every(r => r.expected === r.predicted) && (
                            <div className="text-center">
                              <p className="text-sm text-green-600 mb-4">
                                🎉 Perfect! Your model passed all test cases.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
