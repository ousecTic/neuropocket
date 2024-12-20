import { useState, useEffect } from 'react';

export function DemoVideo() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      {isOnline ? (
        <img
          src="demo.gif"
          alt="Students from different schools exploring NeuroPocket as part of the offline-first AI curriculum at learnaianywhere.org"
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src="/offline-demo.png"
          alt="Offline demo preview"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}