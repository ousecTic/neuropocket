import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';

const MAX_PROJECT_NAME_LENGTH = 50;

interface CreateProjectDialogProps {
  variant?: 'default' | 'full-width';
  onClose?: () => void;
}

export function CreateProjectDialog({ variant = 'default', onClose }: CreateProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const createProject = useProjectStore(state => state.createProject);

  const handleSubmit = async () => {
    if (!projectName.trim()) return;
    
    const result = await createProject(projectName.trim());
    if (result.success && result.projectId) {
      setProjectName('');
      setError(null);
      setIsOpen(false);
      onClose?.();
      // Navigate to the new project
      navigate(`/project/${result.projectId}`);
    } else {
      setError(result.error || 'Error creating project');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen && !onClose) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setError(null);
        }}
        className={`
          flex items-center justify-center gap-2 bg-blue-600 text-white 
          hover:bg-blue-700 transition-colors
          ${variant === 'full-width' 
            ? 'w-full py-4 text-lg rounded-lg' 
            : 'px-6 py-3 rounded-lg text-base'
          }
        `}
      >
        <Plus size={variant === 'full-width' ? 24 : 20} />
        Create Project
      </button>
    );
  }

  const dialog = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <input
              type="text"
              value={projectName}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_PROJECT_NAME_LENGTH) {
                  setProjectName(newValue);
                  setError(null);
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter project name"
              className={`w-full px-3 py-2 border rounded-lg mb-1 ${
                error ? 'border-red-500' : ''
              }`}
              maxLength={MAX_PROJECT_NAME_LENGTH}
              autoFocus
            />
            <div className="text-right text-sm text-gray-500 mb-2">
              {projectName.length}/{MAX_PROJECT_NAME_LENGTH}
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  setIsOpen(false);
                }
                setError(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!projectName.trim()}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return onClose ? dialog : isOpen ? dialog : null;
}