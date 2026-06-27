import React, { useState } from 'react';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { ClassData } from '../types/project';
import { ImageUpload } from './ImageUpload';
import { useProjectStore } from '../store/useProjectStore';
import { MAX_CLASS_NAME_LENGTH } from '../constants';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from './ConfirmDialog';

interface ClassCardProps {
  projectId: string;
  classData: ClassData;
}

export function ClassCard({ projectId, classData }: ClassCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(classData.name);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { renameClass, deleteClass, addImageToClass, deleteImageFromClass } = useProjectStore();
  const { t } = useTranslation();

  const handleRename = async () => {
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
      setRenameError(result.error || t('classCard.renameError'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        {isRenaming ? (
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-1">
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
                onKeyPress={handleKeyPress}
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
                type="button"
                onClick={handleRename}
                className="text-primary hover:text-primary-dark px-3 py-1"
                disabled={!newName.trim()}
              >
                {t('common.save')}
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
                {t('common.cancel')}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold truncate pr-8" title={classData.name}>{classData.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsRenaming(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
                title={t('classCard.rename')}
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                title={t('classCard.delete')}
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
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={t('classCard.deleteConfirmTitle')}
        message={t('classCard.deleteConfirmMessage', { name: classData.name })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
        onConfirm={() => {
          deleteClass(projectId, classData.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}