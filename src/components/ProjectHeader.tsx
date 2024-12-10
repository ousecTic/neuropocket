import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Plus } from 'lucide-react';

interface ProjectHeaderProps {
  title: string;
  backTo: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ProjectHeader({ title, backTo, action }: ProjectHeaderProps) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <Link
                to={backTo}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 -ml-2"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-3 min-w-0">
                <Brain size={24} className="text-blue-600 flex-shrink-0" />
                <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
              </div>
            </div>
            {action && (
              <button
                onClick={action.onClick}
                className="ml-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                <Plus size={20} />
                {action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}