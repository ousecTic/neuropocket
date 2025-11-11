import React, { useState, useRef, useEffect } from 'react';
import Play from 'lucide-react/dist/esm/icons/play';
import Upload from 'lucide-react/dist/esm/icons/upload';
import Camera from 'lucide-react/dist/esm/icons/camera';
import SwitchCamera from 'lucide-react/dist/esm/icons/switch-camera';
import X from 'lucide-react/dist/esm/icons/x';
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
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  // Check if this specific project has been trained
  const isProjectTrained = isTrained && currentProjectId === project.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previousClassCount = useRef(project.classes.length);

  // Reset training state if classes are modified
  useEffect(() => {
    if (project.classes.length !== previousClassCount.current) {
      resetTrainingState();
      setPrediction(null);
      previousClassCount.current = project.classes.length;
    }
  }, [project.classes.length, resetTrainingState]);

  // Center crop and resize image to square
  const centerCropImage = (dataUrl: string, targetSize: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // CENTER CROP: Calculate the center square from the image
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        
        // Set canvas to target size
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw center square from image, scaled to target size
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, targetSize, targetSize);
        
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  };

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
        const originalDataUrl = event.target?.result as string;
        
        // Center crop and resize to 300x300 for consistency
        const processedDataUrl = await centerCropImage(originalDataUrl, 300);
        setSelectedImage(processedDataUrl);

        // Make prediction
        const result = await predict(processedDataUrl);
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

  // Camera functions
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError('');
    try {
      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      
      // Provide helpful error messages based on the error type
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera access when prompted, or check your browser settings.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on your device.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError('Unable to access camera. Please check your browser settings and try again.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleFlipCamera = async () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    stopCamera();
    setShowCamera(false);
    setCameraError('');
  };

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // CENTER CROP: Calculate the center square from video
    const size = Math.min(video.videoWidth, video.videoHeight);
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;

    // Set canvas to target size (300x300)
    canvas.width = 300;
    canvas.height = 300;

    // Draw center square from video, scaled to 300x300
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, 300, 300);

    // Get image as data URL
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Close camera and process image
    handleCloseCamera();
    setPrediction(null);
    setIsProcessing(true);
    setSelectedImage(photoDataUrl);

    try {
      // Make prediction
      const result = await predict(photoDataUrl);
      if (result) {
        setPrediction({
          className: result.className,
          probability: result.probability
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start camera when modal opens
  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
    return () => {
      if (showCamera) {
        stopCamera();
      }
    };
  }, [showCamera]);

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
            <div className="mb-4 flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={handleOpenCamera}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Camera size={20} />
                Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                <Upload size={20} />
                Upload Photo
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

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-white border-b px-4 py-3 flex items-center justify-between rounded-t-lg">
              <h3 className="text-lg font-semibold">Take Photo</h3>
              <div className="flex items-center gap-2">
                {!cameraError && (
                  <button
                    type="button"
                    onClick={handleFlipCamera}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Flip camera"
                  >
                    <SwitchCamera size={20} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseCamera}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {cameraError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600 font-medium mb-3">{cameraError}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Please allow camera access when prompted, or check your device settings to enable camera permissions for this app.
                  </p>
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-xs mx-auto">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!cameraError && (
              <div className="flex-shrink-0 bg-white border-t px-4 py-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Camera size={20} />
                  <span>Capture Photo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}