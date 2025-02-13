import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neuropocket.app',
  appName: 'Neuropocket',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

// @ts-ignore - Electron specific configuration
config.electron = {
  customUrlScheme: 'neuropocket',
  deepLinkingEnabled: false,
  windowOptions: {
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  }
};

export default config;
