import { useState, useEffect } from 'react';
import { ProjectHeader } from '../components/ProjectHeader';
import { mlService } from '../services/ml';
import { ChallengeIntro } from '../components/ChallengeIntro';
import { CheckCircle2 } from 'lucide-react';

interface ImageItem {
  id: string;
  name: string;
  type: 'apple' | 'pear';
  src: string;
  selected: boolean;
}

interface TrainingProgress {
  epoch: number;
  loss: number;
  accuracy: number;
}

interface TestResult {
  imageName: string;
  expected: string;
  predicted: string;
  confidence: number;
}

export function Challenge() {
  const [selectedApples, setSelectedApples] = useState<string[]>([]);
  const [selectedPears, setSelectedPears] = useState<string[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress | null>(null);
  const [trainingResult, setTrainingResult] = useState<{
    finalLoss: number;
    finalAccuracy: number;
    totalEpochs: number;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTrained, setIsTrained] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Load validation images
  const [validationImages, setValidationImages] = useState<{ name: string; src: string }[]>([]);

  useEffect(() => {
    // Load MobileNet model when component mounts
    const loadModel = async () => {
      setError(null);
      setIsModelLoaded(false);
      try {
        const success = await mlService.loadMobileNet();
        setIsModelLoaded(success);
        if (!success) {
          setError('Failed to load the model. Please refresh the page and try again.');
        }
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load the model. Please refresh the page and try again.');
        setIsModelLoaded(false);
      }
    };

    loadModel();

    // Import all images from the challenge folder
    const importImages = async () => {
      const imageModules = import.meta.glob('/src/assets/challenge/**/*.{png,jpg,jpeg}', { eager: true });
      const loadedImages: ImageItem[] = [];
      
      for (const path in imageModules) {
        const module = imageModules[path] as { default: string };
        const id = path.split('/').pop()?.split('.')[0] || '';
        const type = path.toLowerCase().includes('apple') ? 'apple' : 'pear';
        const name = type === 'apple' ? `Apple ${id}` : `Pear ${id}`;
        
        loadedImages.push({
          id,
          name,
          type,
          src: module.default,
          selected: false
        });
      }
      
      setImages(loadedImages);
    };

    importImages();

    return () => {
      mlService.dispose();
    };
  }, []);

  useEffect(() => {
    const loadValidationImages = async () => {
      const imageModules = import.meta.glob('/src/assets/challenge/validation/*.{png,jpg,jpeg}', { eager: true });
      
      const images = Object.entries(imageModules).map(([path, module]) => ({
        name: path.split('/').pop() || '',
        src: (module as { default: string }).default
      }));

      setValidationImages(images);
    };

    loadValidationImages();
  }, []);

  const handleImageSelect = (image: ImageItem) => {
    if (image.type === 'apple') {
      if (selectedApples.includes(image.id)) {
        setSelectedApples(prev => prev.filter(id => id !== image.id));
      } else if (selectedApples.length < 10) {
        setSelectedApples(prev => [...prev, image.id]);
      }
    } else {
      if (selectedPears.includes(image.id)) {
        setSelectedPears(prev => prev.filter(id => id !== image.id));
      } else if (selectedPears.length < 10) {
        setSelectedPears(prev => [...prev, image.id]);
      }
    }
  };

  const handleStartTraining = async () => {
    if (!isModelLoaded) {
      setError('Model is not loaded yet. Please wait.');
      return;
    }

    if (selectedApples.length === 0 || selectedPears.length === 0) {
      setError('Please select at least one image for each category.');
      return;
    }

    setError(null);
    setIsTraining(true);
    setTrainingProgress(null);

    // Get the selected images
    const appleImages = selectedApples
      .map(id => images.find(img => img.id === id))
      .filter((img): img is ImageItem => img !== undefined);

    const pearImages = selectedPears
      .map(id => images.find(img => img.id === id))
      .filter((img): img is ImageItem => img !== undefined);

    // Validate we have images for both classes
    if (appleImages.length === 0 || pearImages.length === 0) {
      setError('Failed to prepare training data. Please try selecting different images.');
      setIsTraining(false);
      return;
    }

    console.log('Training data:', {
      apples: appleImages.length,
      pears: pearImages.length
    });

    // Prepare training data
    const classes = [
      {
        name: 'Apple',
        images: appleImages.map(img => img.src)
      },
      {
        name: 'Pear',
        images: pearImages.map(img => img.src)
      }
    ];

    console.log('Training with classes:', classes);

    try {
      const success = await mlService.trainModel(classes, (epoch, logs) => {
        setTrainingProgress({
          epoch,
          loss: logs.loss,
          accuracy: logs.acc
        });
        
        // Update final results on each epoch
        setTrainingResult({
          finalLoss: logs.loss,
          finalAccuracy: logs.acc,
          totalEpochs: epoch + 1
        });
      });

      if (success) {
        setIsTrained(true);
        setError(null);
      } else {
        setError('Training failed. Please try again with different images.');
        setTrainingResult(null);
      }
    } catch (err) {
      console.error('Training error:', err);
      setError('An error occurred during training. Please try again with different images.');
      setTrainingResult(null);
    } finally {
      setIsTraining(false);
    }
  };

  const handleStartTesting = async () => {
    if (!isTrained) {
      setError('Please train the model first before testing.');
      return;
    }

    setIsTesting(true);
    setTestResults([]);
    setError(null);

    try {
      // Test each validation image
      for (const image of validationImages) {
        const prediction = await mlService.predict(image.src);
        if (!prediction) {
          throw new Error(`Failed to get prediction for ${image.name}`);
        }

        // Add test result
        setTestResults(prev => [...prev, {
          imageName: image.name,
          expected: image.name.toLowerCase().includes('apple') ? 'Apple' : 'Pear',
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

  return (
    <div className="min-h-screen bg-gray-100">
      <ProjectHeader 
        title="AI Bias Challenge" 
        backTo="/"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {showIntro ? (
          <ChallengeIntro onDismiss={() => setShowIntro(false)} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Section 1: Image Selection Gallery */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">1. Select Training Images</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Apples Section */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-800">Apples</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        Selected: {selectedApples.length}/10
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto p-2">
                    {images
                      .filter(img => img.type === 'apple')
                      .map(image => (
                        <div
                          key={image.id}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
                            selectedApples.includes(image.id)
                              ? 'border-blue-500 shadow-lg'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          onClick={() => handleImageSelect(image)}
                        >
                          <img
                            src={image.src}
                            alt="Apple"
                            className="w-full h-full object-cover"
                          />
                          {selectedApples.includes(image.id) && (
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

                {/* Pears Section */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-800">Pears</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        Selected: {selectedPears.length}/10
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto p-2">
                    {images
                      .filter(img => img.type === 'pear')
                      .map(image => (
                        <div
                          key={image.id}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
                            selectedPears.includes(image.id)
                              ? 'border-blue-500 shadow-lg'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          onClick={() => handleImageSelect(image)}
                        >
                          <img
                            src={image.src}
                            alt="Pear"
                            className="w-full h-full object-cover"
                          />
                          {selectedPears.includes(image.id) && (
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
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">
                    Select up to 10 images for each category. Click an image to select/deselect it.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Training */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">2. Train Your Model</h2>
              
              <div className="space-y-6">
                {/* Training Status */}
                {isTraining && trainingProgress && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">
                        Training in progress...
                      </span>
                      <span className="text-sm text-blue-600">
                        Epoch {trainingProgress.epoch + 1}/50
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">Loss:</span>
                        <span className="text-sm text-blue-800">{trainingProgress.loss.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">Accuracy:</span>
                        <span className="text-sm text-blue-800">{(trainingProgress.accuracy * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Training Results */}
                {!isTraining && trainingResult && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">
                        Training Complete!
                      </span>
                      <span className="text-sm text-green-600">
                        {trainingResult.totalEpochs} epochs
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">Final Loss:</span>
                        <span className="text-sm text-green-800">{trainingResult.finalLoss.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">Final Accuracy:</span>
                        <span className="text-sm text-green-800">{(trainingResult.finalAccuracy * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-green-600">
                      Your model has been trained! Proceed to the testing section to evaluate its performance.
                    </p>
                  </div>
                )}

                {/* Training Button */}
                <div className="flex flex-col items-center">
                  <p className="text-gray-600 mb-4 text-center max-w-md">
                    {!isModelLoaded 
                      ? 'Loading model...' 
                      : selectedApples.length === 0 || selectedPears.length === 0
                        ? 'Select at least one image from each category to start training'
                        : 'Ready to train! Click the button below to start training your model.'}
                  </p>
                  <button
                    onClick={handleStartTraining}
                    disabled={isTraining || !isModelLoaded || selectedApples.length === 0 || selectedPears.length === 0}
                    className={`px-6 py-3 rounded-lg font-medium text-white ${
                      isTraining || !isModelLoaded || selectedApples.length === 0 || selectedPears.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isTraining ? 'Training in Progress...' : 'Start Training'}
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Testing */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">3. Test Your Model</h2>

              {!isTrained ? (
                <p className="text-gray-600 text-center">
                  Train your model first before testing.
                </p>
              ) : (
                <div className="space-y-6">
                  {/* Test Button */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleStartTesting}
                      disabled={isTesting || !isTrained}
                      className={`px-6 py-3 rounded-lg font-medium text-white ${
                        isTesting || !isTrained
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
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
