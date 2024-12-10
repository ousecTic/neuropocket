import React, { useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { ClassData } from '../types/project';
import { ImageUpload } from './ImageUpload';
import { useProjectStore } from '../store/useProjectStore';

interface ClassCardProps {
  projectId: string;
  classData: ClassData;
}

export function ClassCard({ projectId, classData }: ClassCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(classData.name);
  const [renameError, setRenameError] = useState<string | null>(null);
  
  const { renameClass, deleteClass, addImageToClass, deleteImageFromClass } = useProjectStore();

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === classData.name) {
      setIsRenaming(false);
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
      <div className="flex justify-between items-center mb-4">
        {isRenaming ? (
          <form onSubmit={handleRename} className="flex gap-2 flex-1">
            <div className="flex-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setRenameError(null);
                }}
                className={`w-full px-2 py-1 border rounded ${
                  renameError ? 'border-red-500' : ''
                }`}
                autoFocus
              />
              {renameError && (
                <p className="text-red-500 text-sm mt-1">{renameError}</p>
              )}
            </div>
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-800"
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
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{classData.name}</h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <MoreVertical size={20} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      setIsRenaming(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Pencil size={16} />
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this class?')) {
                        deleteClass(projectId, classData.id);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mb-4">
        <ImageUpload
          onUpload={(dataUrls) => addImageToClass(projectId, classData.id, dataUrls)}
        />
      </div>

      {classData.images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {classData.images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square"
            >
              <img
                src={image.dataUrl}
                alt=""
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => deleteImageFromClass(projectId, classData.id, image.id)}
                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">
          No images added yet
        </p>
      )}
    </div>
  );
}