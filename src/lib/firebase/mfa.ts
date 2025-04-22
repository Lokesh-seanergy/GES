import { 
  auth, 
  multiFactor, 
  PhoneAuthProvider, 
  PhoneMultiFactorGenerator 
} from './config';
import { User } from 'firebase/auth';

export const isMFAEnabled = async (user: User) => {
  const enrolledFactors = await multiFactor(user).enrolledFactors;
  return enrolledFactors.length > 0;
};

export const enrollUserInMFA = async (user: User, phoneNumber: string) => {
  const session = await multiFactor(user).getSession();
  const phoneInfoOptions = {
    phoneNumber,
    session
  };

  const phoneAuthProvider = new PhoneAuthProvider(auth);
  const verificationId = await phoneAuthProvider.verifyPhoneNumber(
    phoneInfoOptions,
    window.recaptchaVerifier
  );

  return verificationId;
};

export const verifyAndEnrollMFA = async (
  user: User,
  verificationId: string,
  verificationCode: string
) => {
  const credential = PhoneAuthProvider.credential(
    verificationId,
    verificationCode
  );
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
  
  await multiFactor(user).enroll(multiFactorAssertion, 'Phone Number');
};

export const verifyMFA = async (
  user: User,
  verificationId: string,
  verificationCode: string
) => {
  const credential = PhoneAuthProvider.credential(
    verificationId,
    verificationCode
  );
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
  
  await multiFactor(user).enroll(multiFactorAssertion);
}; 