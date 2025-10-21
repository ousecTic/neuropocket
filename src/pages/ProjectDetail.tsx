import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Brain from 'lucide-react/dist/esm/icons/brain';
import Plus from 'lucide-react/dist/esm/icons/plus';
import { useProjectStore } from '../store/useProjectStore';
import { useMLStore } from '../store/useMLStore';
import { ClassCard } from '../components/ClassCard';
import { TrainingSection } from '../components/TrainingSection';
import { PreviewSection } from '../components/PreviewSection';
import { ProjectHeader } from '../components/ProjectHeader';
import { TrainingStatusBanner } from '../components/TrainingStatusBanner';
import { MAX_CLASS_NAME_LENGTH } from '../constants';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { projects, loading, loadProjects, addClass } = useProjectStore();
  const { isTrained, currentProjectId } = useMLStore();
  const project = projects.find(p => p.id === id);

  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [classError, setClassError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'classes' | 'training' | 'preview'>('classes');
  
  // Check if requirements are met for each tab
  const canTrain = project ? (project.classes.length >= 2 && 
                   project.classes.every(c => c.images.length > 0)) : false;
  // Model tab requires: trained AND current data still meets requirements
  const canTest = project ? (isTrained && currentProjectId === project.id && canTrain) : false;

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleAddClass = async () => {
    if (!newClassName.trim() || !id) return;

    const result = await addClass(id, newClassName.trim());
    if (result.success) {
      setNewClassName('');
      setClassError(null);
      setIsAddingClass(false);
      
      // Scroll to the newly created group after a short delay
      setTimeout(() => {
        const groupElements = document.querySelectorAll('[data-group-card]');
        const lastGroup = groupElements[groupElements.length - 1];
        if (lastGroup) {
          lastGroup.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    } else {
      setClassError(result.error || 'Error adding class');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddClass();
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
        <ProjectHeader title="Project Not Found" backTo="/" />
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
        backTo="/"
      />

      {/* Section Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-30 border-b">
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
              1. Data
            </button>
            <button
              onClick={() => canTrain && setActiveSection('training')}
              disabled={!canTrain}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeSection === 'training'
                  ? 'border-blue-600 text-blue-600'
                  : !canTrain
                    ? 'border-transparent text-gray-300 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              2. Training
            </button>
            <button
              onClick={() => canTest && setActiveSection('preview')}
              disabled={!canTest}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeSection === 'preview'
                  ? 'border-blue-600 text-blue-600'
                  : !canTest
                    ? 'border-transparent text-gray-300 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              3. Model
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Persistent Status Banner */}
        <TrainingStatusBanner 
          projectId={project.id}
          classes={project.classes.map(c => ({
            name: c.name,
            images: c.images.map(img => img.dataUrl)
          }))}
          currentTab={activeSection === 'classes' ? 'data' : activeSection === 'training' ? 'training' : 'model'}
          onGoToData={() => setActiveSection('classes')}
          onGoToTraining={() => setActiveSection('training')}
          onGoToModel={() => setActiveSection('preview')}
        />
        
        {activeSection === 'classes' && (
          <div className="space-y-6">
            {project.classes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="max-w-md mx-auto">
                  <Brain size={48} className="mx-auto text-blue-600 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Create Your First Group</h2>
                  <p className="text-gray-600 mb-6">
                    Start by creating groups for different objects or categories you want to recognize
                  </p>
                  <button
                    onClick={() => {
                      setIsAddingClass(true);
                      setClassError(null);
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    Add Your First Group
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {project.classes.map((classData) => (
                    <div key={classData.id} data-group-card>
                      <ClassCard
                        projectId={project.id}
                        classData={classData}
                      />
                    </div>
                  ))}
                </div>
                
                {project.classes.length >= 2 && 
                 project.classes.every(c => c.images.length > 0) && (
                  <div className="mt-8 space-y-4">
                    <div className="text-center">
                      <button
                        onClick={() => setActiveSection('training')}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors hover:bg-blue-600 font-medium"
                      >
                        Continue to Training →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'training' && (
          <TrainingSection 
            project={project}
            onTrainingComplete={() => setActiveSection('preview')}
          />
        )}
        {activeSection === 'preview' && (
          <PreviewSection 
            project={project} 
            onGoBackToData={() => setActiveSection('classes')}
          />
        )}
      </div>

      {/* Floating Add Group Button - Only show in classes section when there are groups */}
      {activeSection === 'classes' && project.classes.length > 0 && (
        <button
          onClick={() => {
            setIsAddingClass(true);
            setClassError(null);
          }}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center gap-2"
          title="Add Group"
        >
          <Plus size={24} />
          <span className="hidden sm:inline font-medium">Add Group</span>
        </button>
      )}

      {/* Add Group Dialog */}
      {isAddingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add New Group</h2>
            <form onSubmit={(e) => e.preventDefault()}>
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
                  onKeyPress={handleKeyPress}
                  placeholder="Enter group name"
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
                  type="button"
                  onClick={handleAddClass}
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