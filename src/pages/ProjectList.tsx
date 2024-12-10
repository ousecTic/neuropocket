import React, { useEffect } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectHeader } from '../components/ProjectHeader';
import { useProjectStore } from '../store/useProjectStore';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { Brain } from 'lucide-react';

export function ProjectList() {
  const { projects, loading, loadProjects } = useProjectStore();
  const [isCreating, setIsCreating] = React.useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ProjectHeader 
        title="My Projects" 
        backTo="/"
        action={projects.length > 0 ? {
          label: "Create Project",
          onClick: () => setIsCreating(true)
        } : undefined}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm px-4 py-16">
            <div className="w-full max-w-md text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Brain size={48} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Create Your First Project</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Start your AI journey by creating a new project
              </p>
              <CreateProjectDialog variant="full-width" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {isCreating && <CreateProjectDialog onClose={() => setIsCreating(false)} />}
    </div>
  );
}