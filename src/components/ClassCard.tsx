import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ClassData } from '../types/project';
import { ImageUpload } from './ImageUpload';
import { useProjectStore } from '../store/useProjectStore';
import { MAX_CLASS_NAME_LENGTH } from '../constants';

interface ClassCardProps {
  projectId: string;
  classData: ClassData;
}

export function ClassCard({ projectId, classData }: ClassCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(classData.name);
  const [renameError, setRenameError] = useState<string | null>(null);
  
  const { renameClass, deleteClass, addImageToClass, deleteImageFromClass } = useProjectStore();

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      return;
    }
    if (newName === classData.name) {
      setIsRenaming(false);
      setRenameError(null);
      return;
    }
    const result = await renameClass(projectId, classData.id, newName.trim());
    if (result.success) {
      setIsRenaming(false);
      setRenameError(null);
    } else {
      setRenameError(result.error || 'Error renaming class');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        {isRenaming ? (
          <form onSubmit={handleRename} className="flex flex-col flex-1">
            <div className="flex-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_CLASS_NAME_LENGTH) {
                    setNewName(value);
                    setRenameError(null);
                  }
                }}
                className={`w-full px-2 py-1 border rounded ${
                  renameError ? 'border-red-500' : ''
                }`}
                maxLength={MAX_CLASS_NAME_LENGTH}
                autoFocus
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {newName.length}/{MAX_CLASS_NAME_LENGTH}
              </div>
              {renameError && (
                <p className="text-red-500 text-sm mt-1">{renameError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="submit"
                className="text-blue-600 hover:text-blue-800 px-3 py-1"
                disabled={!newName.trim()}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewName(classData.name);
                  setIsRenaming(false);
                  setRenameError(null);
                }}
                className="text-gray-600 hover:text-gray-800 px-3 py-1"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold truncate pr-8" title={classData.name}>{classData.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsRenaming(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                title="Rename Class"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this class?')) {
                    deleteClass(projectId, classData.id);
                  }
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                title="Delete Class"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </>
        )}
      </div>
      
      <ImageUpload
        onUpload={(files) => addImageToClass(projectId, classData.id, files)}
        onDelete={(imageId) => deleteImageFromClass(projectId, classData.id, imageId)}
        images={classData.images}
      />
    </div>
  );
}