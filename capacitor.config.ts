import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4da6cb5631c647c3ab64f44b805c9737',
  appName: 'MedVision AI',
  webDir: 'dist',
  server: {
    url: 'https://4da6cb56-31c6-47c3-ab64-f44b805c9737.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      presentationStyle: 'fullscreen'
    }
  }
};

export default config;
