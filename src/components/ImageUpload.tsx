import React, { useRef, useState, useEffect } from 'react';
import Upload from 'lucide-react/dist/esm/icons/upload';
import X from 'lucide-react/dist/esm/icons/x';
import Camera from 'lucide-react/dist/esm/icons/camera';
import SwitchCamera from 'lucide-react/dist/esm/icons/switch-camera';
import { ClassImage } from '../types/project';

interface ImageUploadProps {
  onUpload: (dataUrls: string[]) => void;
  onDelete?: (imageId: string) => void;
  images?: ClassImage[];
}

export function ImageUpload({ onUpload, onDelete, images = [] }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Function to center crop and resize an image to a square
  const resizeImage = (dataUrl: string, targetSize: number): Promise<string> => {
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
        
        // Convert canvas to data URL with slightly reduced quality
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(resizedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  };

  // Start camera stream
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError('');
    try {
      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Request camera access with mobile-friendly constraints
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

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Flip camera between front and back
  const handleFlipCamera = async () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  // Open camera modal
  const handleOpenCamera = () => {
    setShowCamera(true);
    setCapturedPhotos([]);
  };

  // Close camera modal
  const handleCloseCamera = () => {
    stopCamera();
    setShowCamera(false);
    setCapturedPhotos([]);
    setCameraError('');
  };

  // Capture photo from video stream
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
    // drawImage(source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, 300, 300);
    
    // Get image as data URL
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhotos(prev => [...prev, photoDataUrl]);
  };

  // Delete a captured photo
  const handleDeleteCapturedPhoto = (index: number) => {
    setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Save all captured photos
  const handleSavePhotos = () => {
    if (capturedPhotos.length > 0) {
      onUpload(capturedPhotos);
      handleCloseCamera();
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = Array.from(e.target.files || []);
    const validFiles: string[] = [];
    
    for (const file of files) {
      // Check file type more strictly
      if (!file.type.startsWith('image/') || !['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        alert(`"${file.name}" is not a valid image file. Please upload only PNG or JPG files.`);
        continue;
      }

      try {
        // First read the file as data URL
        const originalDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // Center crop and resize the image to 300x300
        const resizedDataUrl = await resizeImage(originalDataUrl, 300);
        validFiles.push(resizedDataUrl);
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`Error processing file ${file.name}`);
      }
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(false);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Image Grid */}
        {images.length > 0 && (
          <div className="max-h-[32rem] overflow-y-auto border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {images.map((image) => (
                <div key={image.id} className="relative group aspect-square">
                  <img
                    src={image.dataUrl}
                    alt="Class example"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {onDelete && (
                    <button
                      onClick={() => onDelete(image.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 bg-opacity-70 hover:bg-opacity-100 rounded-full text-white shadow transition-all hover:scale-110"
                      title="Delete image"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Camera Button */}
          <button
            type="button"
            onClick={handleOpenCamera}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Camera size={20} />
            <span>Take Photos</span>
          </button>

          {/* Upload Button */}
          <label className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors font-medium ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
            <Upload size={20} />
            <span>Upload Photos</span>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-sm font-medium">Processing images...</span>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-white border-b px-4 py-3 flex items-center justify-between rounded-t-lg">
              <h3 className="text-lg font-semibold">Take Photos</h3>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <>
                  {/* Camera Preview */}
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

                  {/* Captured Photos Grid */}
                  {capturedPhotos.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-700">
                          Captured Photos ({capturedPhotos.length})
                        </h4>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {capturedPhotos.map((photo, index) => (
                          <div key={index} className="relative aspect-square group">
                            <img
                              src={photo}
                              alt={`Captured ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteCapturedPhoto(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 bg-opacity-70 hover:bg-opacity-100 rounded-full text-white shadow transition-all"
                              title="Delete photo"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer - Only show when camera is working */}
            {!cameraError && (
              <div className="flex-shrink-0 bg-white border-t px-4 py-3 flex gap-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <Camera size={20} />
                  <span>Capture</span>
                </button>
                <button
                  type="button"
                  onClick={handleSavePhotos}
                  disabled={capturedPhotos.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add Photos {capturedPhotos.length > 0 && `(${capturedPhotos.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}