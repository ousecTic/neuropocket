import React, { useEffect } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectHeader } from '../components/ProjectHeader';
import { useProjectStore } from '../store/useProjectStore';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import Network from 'lucide-react/dist/esm/icons/network';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ProjectList() {
  const { projects, loading, loadProjects } = useProjectStore();
  const [isCreating, setIsCreating] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('projectList.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectHeader
        title={t('projectList.title')}
        action={projects.length > 0 ? {
          label: t('projectList.createProject'),
          onClick: () => setIsCreating(true)
        } : undefined}
        secondaryAction={projects.length > 0 ? {
          label: t('projectList.tryBiasChallenge'),
          onClick: () => navigate('/challenge')
        } : undefined}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm px-4 py-16">
            <div className="w-full max-w-md text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Network size={48} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('projectList.emptyTitle')}</h2>
              <p className="text-gray-600 mb-8 text-lg">
                {t('projectList.emptyDescription')}
              </p>
              <div className="space-y-4">
                <CreateProjectDialog variant="full-width" />
                <button
                  onClick={() => navigate('/challenge')}
                  className="w-full py-4 text-lg rounded-lg flex items-center justify-center gap-2
                    border-2 border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                >
                  {t('projectList.orTryChallenge')}
                </button>
              </div>
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