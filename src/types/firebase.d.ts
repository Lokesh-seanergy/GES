declare module 'firebase/app' {
  export interface FirebaseOptions {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  }

  export interface FirebaseApp {
    name: string;
    options: FirebaseOptions;
  }

  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
  export function getApp(name?: string): FirebaseApp;
}

declare module 'firebase/auth' {
  import type { FirebaseApp } from 'firebase/app';
  
  export interface Auth {
    app: FirebaseApp;
    currentUser: User | null;
  }

  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  }

  export interface UserCredential {
    user: User;
  }

  export function getAuth(app?: FirebaseApp): Auth;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function signOut(auth: Auth): Promise<void>;
}

declare module 'firebase/firestore' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Firestore {
    app: FirebaseApp;
  }

  export interface DocumentData {
    [key: string]: unknown;
  }

  export interface QuerySnapshot<T = DocumentData> {
    docs: Array<QueryDocumentSnapshot<T>>;
    empty: boolean;
    size: number;
  }

  export interface QueryDocumentSnapshot<T = DocumentData> {
    id: string;
    data(): T;
  }

  export interface CollectionReference {
    path: string;
  }

  export interface DocumentReference {
    path: string;
  }

  export function getFirestore(app?: FirebaseApp): Firestore;
  export function collection(firestore: Firestore, path: string): CollectionReference;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  export function getDocs(query: CollectionReference): Promise<QuerySnapshot>;
  export function setDoc(reference: DocumentReference, data: DocumentData): Promise<void>;
}

declare module 'firebase/storage' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Storage {
    app: FirebaseApp;
  }

  export interface StorageReference {
    fullPath: string;
  }

  export interface UploadResult {
    ref: StorageReference;
  }

  export function getStorage(app?: FirebaseApp): Storage;
  export function ref(storage: Storage, path?: string): StorageReference;
  export function uploadBytes(reference: StorageReference, data: Blob | Uint8Array | ArrayBuffer): Promise<UploadResult>;
  export function getDownloadURL(reference: StorageReference): Promise<string>;
}

declare module 'firebase/database' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Database {
    app: FirebaseApp;
  }

  export interface DatabaseReference {
    key: string | null;
  }

  export function getDatabase(app?: FirebaseApp): Database;
  export function ref(db: Database, path?: string): DatabaseReference;
  export function set(reference: DatabaseReference, value: unknown): Promise<void>;
  export function get(reference: DatabaseReference): Promise<unknown>;
}

declare module 'firebase/functions' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Functions {
    app: FirebaseApp;
  }

  export interface HttpsCallableResult<T = unknown> {
    data: T;
  }

  export function getFunctions(app?: FirebaseApp): Functions;
  export function httpsCallable<T = unknown, R = unknown>(functions: Functions, name: string): (data?: T) => Promise<HttpsCallableResult<R>>;
}

declare module 'firebase/messaging' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Messaging {
    app: FirebaseApp;
  }

  export function getMessaging(app?: FirebaseApp): Messaging;
  export function getToken(messaging: Messaging, options?: { vapidKey?: string }): Promise<string>;
}

declare module 'firebase/analytics' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Analytics {
    app: FirebaseApp;
  }

  export type EventParams = Record<string, string | number | boolean>;

  export function getAnalytics(app?: FirebaseApp): Analytics;
  export function logEvent(analytics: Analytics, eventName: string, eventParams?: EventParams): void;
}

declare module 'firebase/performance' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Performance {
    app: FirebaseApp;
  }

  export interface Trace {
    start(): void;
    stop(): void;
  }

  export function getPerformance(app?: FirebaseApp): Performance;
  export function trace(performance: Performance, traceName: string): Trace;
}

declare module 'firebase/remote-config' {
  import type { FirebaseApp } from 'firebase/app';

  export interface RemoteConfig {
    app: FirebaseApp;
  }

  export interface Value {
    asString(): string;
    asNumber(): number;
    asBoolean(): boolean;
  }

  export function getRemoteConfig(app?: FirebaseApp): RemoteConfig;
  export function getValue(remoteConfig: RemoteConfig, key: string): Value;
  export function fetchAndActivate(remoteConfig: RemoteConfig): Promise<boolean>;
} 