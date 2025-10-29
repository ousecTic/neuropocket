import { Link } from 'react-router-dom';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Plus from 'lucide-react/dist/esm/icons/plus';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import { useState } from 'react';

interface ProjectHeaderProps {
  title: string;
  backTo?: string;
  backToExternal?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  customContent?: React.ReactNode;
}

export function ProjectHeader({ title, backTo, backToExternal, action, secondaryAction, customContent }: ProjectHeaderProps) {
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
              {backTo && (
                backToExternal ? (
                  <a
                    href={backTo}
                    className="mr-4 p-2 text-gray-600 hover:text-gray-900 -ml-2"
                  >
                    <ArrowLeft size={20} />
                  </a>
                ) : (
                  <Link
                    to={backTo}
                    className="mr-4 p-2 text-gray-600 hover:text-gray-900 -ml-2"
                  >
                    <ArrowLeft size={20} />
                  </Link>
                )
              )}
              <div className="flex items-center gap-3 min-w-0">
                <img src="/neuropocket-logo.png" alt="NeuroPocket" className="flex-shrink-0" style={{ height: '32px', width: 'auto' }} />
                <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
              </div>
            </div>

            {/* Custom Content or Desktop Actions */}
            {customContent ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                {customContent}
              </div>
            ) : (
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
            )}

            {/* Mobile Menu Button - Only show if there are multiple actions */}
            {hasMultipleActions && (
              <div className="sm:hidden">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            )}

            {/* Single Mobile Action - Show directly if there's only one action */}
            {!hasMultipleActions && action && (
              <div className="sm:hidden">
                <button
                  onClick={action.onClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-base whitespace-nowrap"
                >
                  <Plus size={18} className="flex-shrink-0" />
                  {action.label}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && hasMultipleActions && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              {action && (
                <button
                  onClick={() => handleActionClick(action.onClick)}
                  className="flex items-center gap-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-base"
                >
                  <Plus size={18} className="flex-shrink-0" />
                  {action.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  onClick={() => handleActionClick(secondaryAction.onClick)}
                  className="flex items-center gap-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-base"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}