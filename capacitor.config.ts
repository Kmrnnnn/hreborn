import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4870051ef09a413e8f34a5a2214e94da',
  appName: '健康地图',
  webDir: 'dist',
  server: {
    url: 'https://4870051e-f09a-413e-8f34-a5a2214e94da.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'HealthMap'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#14b8a6',
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#14b8a6'
    }
  }
};

export default config;
