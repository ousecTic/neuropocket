import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWA() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
    });

    return () => {
      updateSW?.();
    };
  }, []);

  return {
    needRefresh,
    offlineReady,
  };
}