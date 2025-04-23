import { auth } from './config';
import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export const setupRecaptcha = (elementId: string) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow phone number sign-in
    },
  });
}; 