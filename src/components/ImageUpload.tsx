import React, { useRef, useState } from 'react';
import Upload from 'lucide-react/dist/esm/icons/upload';
import X from 'lucide-react/dist/esm/icons/x';
import { ClassImage } from '../types/project';

interface ImageUploadProps {
  onUpload: (dataUrls: string[]) => void;
  onDelete?: (imageId: string) => void;
  images?: ClassImage[];
}

export function ImageUpload({ onUpload, onDelete, images = [] }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // Function to resize an image to the specified dimensions
  const resizeImage = (dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        
        // Set canvas dimensions and draw resized image
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to data URL with slightly reduced quality
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(resizedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  };

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
        
        // Resize the image to 300x300 max dimensions
        const resizedDataUrl = await resizeImage(originalDataUrl, 300, 300);
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
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
      )}

      {/* Upload Area */}
      <div className="flex items-center justify-center w-full">
        <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <>
                <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <p className="mb-2 text-sm text-blue-600 font-semibold">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to add images to this group</span>
                </p>
                <p className="text-xs text-gray-500">PNG or JPG files</p>
              </>
            )}
          </div>
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
    </div>
  );
}