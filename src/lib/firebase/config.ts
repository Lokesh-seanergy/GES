import { initializeApp } from 'firebase/app';
import { getAuth, multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDUKdQsy5WFz7mEbwK7mSeD7S4tmsloTQ",
  authDomain: "ges-demo-b2d08.firebaseapp.com",
  projectId: "ges-demo-b2d08",
  storageBucket: "ges-demo-b2d08.appspot.com",
  messagingSenderId: "419716709251",
  appId: "1:419716709251:web:17a178fe3f778b91cd94b6",
  measurementId: "G-PZBBSGWH48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Analytics
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// MFA related exports
export { multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator }; 