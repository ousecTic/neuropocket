import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (dataUrls: string[]) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: string[] = [];
    
    for (const file of files) {
      // Check file type
      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        alert('Please upload only PNG or JPG files');
        continue;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 5MB)`);
        continue;
      }

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        validFiles.push(dataUrl);
      } catch (error) {
        console.error('Error reading file:', error);
        alert(`Error reading file ${file.name}`);
      }
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG or JPG (MAX. 5MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}