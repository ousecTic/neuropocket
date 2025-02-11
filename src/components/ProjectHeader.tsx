import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Plus, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-2 ml-4">
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  {secondaryAction.label}
                </button>
              )}
              {action && (
                <button
                  onClick={action.onClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <Plus size={20} />
                  {action.label}
                </button>
              )}
            </div>

            {/* Mobile dropdown */}
            {(action || secondaryAction) && (
              <div className="sm:hidden relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-100">
                    {action && (
                      <button
                        onClick={() => {
                          action.onClick();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition-colors"
                      >
                        <Plus size={16} className="text-blue-600" />
                        {action.label}
                      </button>
                    )}
                    {secondaryAction && (
                      <button
                        onClick={() => {
                          secondaryAction.onClick();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition-colors"
                      >
                        {secondaryAction.label}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}