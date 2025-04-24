/// <reference types="firebase" />

declare global {
  namespace NodeJS {
    interface Global {
      firebase: {
        app: typeof import('firebase/app');
        auth: typeof import('firebase/auth');
        firestore: typeof import('firebase/firestore');
        storage: typeof import('firebase/storage');
        database: typeof import('firebase/database');
        functions: typeof import('firebase/functions');
        messaging: typeof import('firebase/messaging');
        analytics: typeof import('firebase/analytics');
        performance: typeof import('firebase/performance');
        remoteConfig: typeof import('firebase/remote-config');
      };
    }
  }
} 