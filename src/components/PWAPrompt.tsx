import { useState, useEffect } from 'react';
import X from 'lucide-react/dist/esm/icons/x';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';

export function PWAPrompt() {
  const { t } = useTranslation();
  const { needRefresh, offlineReady } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  // Auto-dismiss offline message after 3 seconds
  useEffect(() => {
    if (offlineReady) {
      setShowOfflineMessage(true);
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady]);

  // Only show if we have a refresh needed or if offline message is still showing
  if (!needRefresh && !showOfflineMessage) return null;
  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {showOfflineMessage && (
            <p className="text-green-600 mb-2">
              {t('pwa.offlineReady')}
            </p>
          )}
          {needRefresh && (
            <div className="flex flex-col gap-2">
              <p className="text-gray-700">
                {t('pwa.newContent')}
              </p>
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                onClick={() => window.location.reload()}
              >
                {t('pwa.reload')}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
          aria-label={t('pwa.dismiss')}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}