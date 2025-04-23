import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { enrollUserInMFA, verifyAndEnrollMFA } from '@/lib/firebase/mfa';
import { setupRecaptcha } from '@/lib/firebase/recaptcha';

interface MFAVerificationProps {
  user: User;
  onComplete: () => void;
}

export default function MFAVerification({ user, onComplete }: MFAVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Setup reCAPTCHA when component mounts
    setupRecaptcha("recaptcha-container");
  }, []);

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      const id = await enrollUserInMFA(user, phoneNumber);
      setVerificationId(id);
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationId) return;
    
    try {
      setIsLoading(true);
      setError('');
      await verifyAndEnrollMFA(user, verificationId, verificationCode);
      onComplete();
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Enable Two-Factor Authentication</h2>
      
      {!verificationId ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 234 567 8900"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSendCode}
            disabled={isLoading || !phoneNumber}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleVerifyCode}
            disabled={isLoading || !verificationCode}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" className="hidden" />
    </div>
  );
} 