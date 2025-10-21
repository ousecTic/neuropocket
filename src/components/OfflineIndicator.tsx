import { useState, useEffect } from 'react';
import WifiOff from 'lucide-react/dist/esm/icons/wifi-off';
import X from 'lucide-react/dist/esm/icons/x';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Hide the offline message after a short delay
      setTimeout(() => setShowOffline(false), 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
      setDismissed(false); // Reset dismiss state when going offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 transition-opacity duration-300 opacity-100">
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-gray-600" />
          <p className="text-gray-700">
            {isOnline 
              ? 'Back online'
              : 'You\'re offline - but don\'t worry, the app works offline!'
            }
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}