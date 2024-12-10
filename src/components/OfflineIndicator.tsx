import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Hide the offline message after a short delay
      setTimeout(() => setShowOffline(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline) return null;

  return (
    <div 
      className={`fixed bottom-4 left-4 z-50 transition-opacity duration-300 ${
        isOnline ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
        <WifiOff className="w-5 h-5 text-gray-600" />
        <p className="text-gray-700">
          {isOnline 
            ? 'Back online'
            : 'You\'re offline - but don\'t worry, the app works offline!'
          }
        </p>
      </div>
    </div>
  );
}