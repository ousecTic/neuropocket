import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Plus, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface ProjectHeaderProps {
  title: string;
  backTo: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function ProjectHeader({ title, backTo, action, secondaryAction }: ProjectHeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const hasMultipleActions = action && secondaryAction;

  const handleActionClick = (callback: () => void) => {
    setShowMobileMenu(false);
    callback();
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
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

            {/* Desktop Actions - Always show both buttons */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              {action && (
                <button
                  onClick={action.onClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-base whitespace-nowrap"
                >
                  <Plus size={18} className="flex-shrink-0" />
                  {action.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-base whitespace-nowrap"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="sm:hidden flex-shrink-0">
              {hasMultipleActions ? (
                // Show dropdown for multiple actions
                <div className="relative">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {showMobileMenu && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMobileMenu(false)}
                      />
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                        {action && (
                          <button
                            onClick={() => handleActionClick(action.onClick)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Plus size={16} className="flex-shrink-0" />
                            {action.label}
                          </button>
                        )}
                        {secondaryAction && (
                          <button
                            onClick={() => handleActionClick(secondaryAction.onClick)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            {secondaryAction.label}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Show single button if only one action
                action && (
                  <button
                    onClick={action.onClick}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                  >
                    <Plus size={16} className="flex-shrink-0" />
                    {action.label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}