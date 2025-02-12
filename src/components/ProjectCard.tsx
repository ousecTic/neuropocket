import React, { useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Project } from '../types/project';
import { useProjectStore } from '../store/useProjectStore';
import { Link } from 'react-router-dom';

const MAX_PROJECT_NAME_LENGTH = 50; // Same limit as CreateProjectDialog

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [error, setError] = useState<string | null>(null);
  
  const { deleteProject, renameProject } = useProjectStore();

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === project.name) {
      setIsRenaming(false);
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

  const totalImages = project.classes.reduce((total, classData) => 
    total + classData.images.length, 0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative hover:shadow-lg transition-shadow">
      {isRenaming ? (
        <form onSubmit={handleRename} className="flex flex-col gap-2">
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
                type="submit"
                className="text-blue-600 hover:text-blue-800 px-3 py-1"
                disabled={!newName.trim() || newName === project.name}
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
                Classes: {project.classes.length}
              </p>
              <p className="text-sm text-gray-500">
                Images: {totalImages}
              </p>
            </div>
          </Link>
          
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical size={20} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 py-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                <button
                  onClick={() => {
                    setIsRenaming(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Rename
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      deleteProject(project.id);
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
  );
}