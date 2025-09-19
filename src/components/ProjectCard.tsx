import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Project } from '../types/project';
import { useProjectStore } from '../store/useProjectStore';
import { Link } from 'react-router-dom';

const MAX_PROJECT_NAME_LENGTH = 50; // Same limit as CreateProjectDialog

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {

  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [error, setError] = useState<string | null>(null);
  
  const { deleteProject, renameProject } = useProjectStore();

  const handleRename = async () => {
    if (!newName.trim()) {
      return;
    }
    if (newName === project.name) {
      setIsRenaming(false);
      setError(null);
      return;
    }
    const result = await renameProject(project.id, newName.trim());
    if (result.success) {
      setIsRenaming(false);
      setError(null);
    } else {
      setError(result.error || 'Error renaming project');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    }
  };

  const totalImages = project.classes.reduce((total, classData) => 
    total + classData.images.length, 0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative hover:shadow-lg transition-shadow">
      {isRenaming ? (
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
          <div className="flex flex-col w-full">
            <div className="flex-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_PROJECT_NAME_LENGTH) {
                    setNewName(value);
                    setError(null);
                  }
                }}
                onKeyPress={handleKeyPress}
                className={`w-full px-2 py-1 border rounded ${
                  error ? 'border-red-500' : ''
                }`}
                maxLength={MAX_PROJECT_NAME_LENGTH}
                autoFocus
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {newName.length}/{MAX_PROJECT_NAME_LENGTH}
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={handleRename}
                className="text-blue-600 hover:text-blue-800 px-3 py-1"
                disabled={!newName.trim()}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewName(project.name);
                  setIsRenaming(false);
                  setError(null);
                }}
                className="text-gray-600 hover:text-gray-800 px-3 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <Link to={`/project/${project.id}`} className="block">
            <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 truncate pr-8" title={project.name}>{project.name}</h3>
            <p className="text-sm text-gray-500">
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-3 mt-1">
              <p className="text-sm text-gray-500">
                Groups: {project.classes.length}
              </p>
              <p className="text-sm text-gray-500">
                Images: {totalImages}
              </p>
            </div>
          </Link>
                    <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsRenaming(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Rename Project"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this project?')) {
                  deleteProject(project.id);
                }
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              title="Delete Project"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}