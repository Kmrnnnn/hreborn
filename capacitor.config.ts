import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hreborn.app',
  appName: 'hreborn',
  webDir: 'dist',
  server: {
    // Remove the hardcoded URL for production build
    cleartext: true
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    scheme: 'hreborn'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#10b981',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
