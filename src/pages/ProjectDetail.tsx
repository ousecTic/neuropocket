import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Brain, Plus } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { ClassCard } from '../components/ClassCard';
import { TrainingSection } from '../components/TrainingSection';
import { PreviewSection } from '../components/PreviewSection';
import { ProjectHeader } from '../components/ProjectHeader';
import { MAX_CLASS_NAME_LENGTH } from '../constants';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { projects, loading, loadProjects, addClass } = useProjectStore();
  const project = projects.find(p => p.id === id);

  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [classError, setClassError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'classes' | 'training' | 'preview'>('classes');

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !id) return;

    const result = await addClass(id, newClassName.trim());
    if (result.success) {
      setNewClassName('');
      setClassError(null);
      setIsAddingClass(false);
    } else {
      setClassError(result.error || 'Error adding class');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100">
        <ProjectHeader title="Project Not Found" backTo="/app" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-red-600 text-lg">Project not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ProjectHeader 
        title={project.name}
        backTo="/app"
        action={activeSection === 'classes' ? {
          label: "Add Class",
          onClick: () => {
            setIsAddingClass(true);
            setClassError(null);
          }
        } : undefined}
      />

      {/* Section Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveSection('classes')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeSection === 'classes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Classes
            </button>
            <button
              onClick={() => setActiveSection('training')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeSection === 'training'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Training
            </button>
            <button
              onClick={() => setActiveSection('preview')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeSection === 'preview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeSection === 'classes' && (
          <div className="space-y-6">
            {project.classes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="max-w-md mx-auto">
                  <Brain size={48} className="mx-auto text-blue-600 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Create Your First Class</h2>
                  <p className="text-gray-600 mb-6">
                    Start by creating classes for different objects or categories you want to recognize
                  </p>
                  <button
                    onClick={() => {
                      setIsAddingClass(true);
                      setClassError(null);
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    Add Your First Class
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {project.classes.map((classData) => (
                  <ClassCard
                    key={classData.id}
                    projectId={project.id}
                    classData={classData}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'training' && <TrainingSection project={project} />}
        {activeSection === 'preview' && <PreviewSection project={project} />}
      </div>

      {/* Add Class Dialog */}
      {isAddingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
            <form onSubmit={handleAddClass}>
              <div className="mb-4">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= MAX_CLASS_NAME_LENGTH) {
                      setNewClassName(value);
                      setClassError(null);
                    }
                  }}
                  placeholder="Enter class name"
                  className={`w-full px-3 py-2 border rounded-lg mb-1 ${
                    classError ? 'border-red-500' : ''
                  }`}
                  maxLength={MAX_CLASS_NAME_LENGTH}
                  autoFocus
                />
                <div className="text-right text-sm text-gray-500">
                  {newClassName.length}/{MAX_CLASS_NAME_LENGTH}
                </div>
                {classError && (
                  <p className="text-red-500 text-sm mt-1">{classError}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingClass(false);
                    setNewClassName('');
                    setClassError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!newClassName.trim()}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}