import React, { useState, useRef, useEffect } from 'react';
import Play from 'lucide-react/dist/esm/icons/play';
import Upload from 'lucide-react/dist/esm/icons/upload';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { useMLStore } from '../store/useMLStore';
import { Project } from '../types/project';

interface PreviewSectionProps {
  project: Project;
  onGoBackToData?: () => void;
}

export function PreviewSection({ project, onGoBackToData }: PreviewSectionProps) {
  const { mobilenet, isTrained, currentProjectId, predict, resetTrainingState } = useMLStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ className: string; probability: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if this specific project has been trained
  const isProjectTrained = isTrained && currentProjectId === project.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousClassCount = useRef(project.classes.length);

  // Reset training state if classes are modified
  useEffect(() => {
    if (project.classes.length !== previousClassCount.current) {
      resetTrainingState();
      setPrediction(null);
      previousClassCount.current = project.classes.length;
    }
  }, [project.classes.length, resetTrainingState]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setPrediction(null);
    setIsProcessing(true);

    try {
      // Read the file
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        setSelectedImage(dataUrl);

        // Make prediction
        const result = await predict(dataUrl);
        if (result) {
          setPrediction({
            className: result.className,
            probability: result.probability
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Check if model can be used
  const canUseModel = mobilenet && isProjectTrained && project.classes.length >= 2;

  if (!canUseModel) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Model hasn't been trained yet</h2>
          <p className="text-gray-600">
            {!mobilenet 
              ? "Loading model..."
              : !isProjectTrained
              ? "Please go to the Training tab to train your model before using this Model tab."
              : "You need at least 2 classes to use the model. Please add more classes."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Play size={48} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Test Your Model</h2>
          <p className="text-gray-600">
            Upload an image to see how well your model performs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload size={20} />
                Upload Image
              </button>
            </div>

            {selectedImage && (
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="flex flex-col justify-center">
            {isProcessing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing image...</p>
              </div>
            ) : prediction ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Prediction Results</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-1">Group</p>
                    <p className="text-xl font-semibold">{prediction.className}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Confidence</p>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xl font-semibold">
                          {(prediction.probability * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${prediction.probability * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedImage ? (
              <div className="text-center py-8 text-gray-500">
                Processing prediction...
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                <h3 className="font-semibold mb-4 text-gray-400">Prediction Results</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 mb-1">Group</p>
                    <div className="h-7 bg-gray-100 rounded w-32"></div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Confidence</p>
                    <div className="h-7 bg-gray-100 rounded w-24"></div>
                    <div className="mt-2 h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Upload an image to see the prediction
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Go Back to Data Button - Only show after user has tested the model */}
        {onGoBackToData && prediction && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Not the results you expected? Try selecting different training images to improve your model.
            </p>
            <button
              onClick={onGoBackToData}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors hover:bg-blue-600 font-medium"
            >
              ← Go Back to Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}