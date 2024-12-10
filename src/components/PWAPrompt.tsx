import { usePWA } from '../hooks/usePWA';

export function PWAPrompt() {
  const { needRefresh, offlineReady } = usePWA();

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      {offlineReady && (
        <p className="text-green-600 mb-2">
          App ready to work offline
        </p>
      )}
      {needRefresh && (
        <div className="flex flex-col gap-2">
          <p className="text-gray-700">
            New content available, click on reload button to update.
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      )}
    </div>
  );
}