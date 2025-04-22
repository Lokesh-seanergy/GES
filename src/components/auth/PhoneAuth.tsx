import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { PhoneAuthProvider, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { setupRecaptcha } from '@/lib/firebase/recaptcha';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { 
  checkRateLimit, 
  getRemainingAttempts, 
  resetRateLimit, 
  sanitizeInput, 
  logSecurityEvent,
  RATE_LIMIT_WINDOW 
} from '@/lib/auth/security';

// Common country codes with flags
const countries = [
  { code: 'SG', dialCode: '+62', flag: '🇸🇬', name: 'Singapore' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
  // Add more countries as needed
];

export default function PhoneAuth() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setupRecaptcha('recaptcha-container');
    localStorage.removeItem('phoneAuthData');
  }, []);

  useEffect(() => {
    return () => {
      setPhoneNumber('');
      setVerificationCode('');
      setConfirmationResult(null);
      setError('');
    };
  }, []);

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\d{1,14}$/;
    const sanitizedNumber = sanitizeInput(number.replace(/\D/g, ''));
    return {
      isValid: phoneRegex.test(sanitizedNumber),
      sanitized: selectedCountry.dialCode + sanitizedNumber
    };
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setShowCountryList(false);
  };

  const handleSendCode = async () => {
    const identifier = `phone-${phoneNumber}`; // Use phone number as rate limit identifier
    if (checkRateLimit(identifier)) {
      const remaining = getRemainingAttempts(identifier);
      setError(`Too many attempts. Please try again in ${Math.ceil(RATE_LIMIT_WINDOW / 60000)} minutes.`);
      logSecurityEvent({
        type: 'rate-limit',
        status: 'failure',
        details: 'Phone auth rate limit exceeded',
        identifier
      });
      return;
    }

    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setError('Please enter a valid phone number in international format (e.g., +1234567890)');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const confirmation = await signInWithPhoneNumber(
        auth,
        validation.sanitized,
        window.recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setError('Verification code sent successfully!');
      
      logSecurityEvent({
        type: 'auth',
        status: 'success',
        details: 'Phone verification code sent',
        identifier
      });
    } catch (err: any) {
      logSecurityEvent({
        type: 'auth',
        status: 'failure',
        details: `Failed to send verification code: ${err.message}`,
        identifier
      });
      setError(err.message || 'Failed to send verification code');
      console.error('Phone auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const identifier = `phone-${phoneNumber}`;
    if (!confirmationResult || !verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const sanitizedCode = sanitizeInput(verificationCode);
      const result = await confirmationResult.confirm(sanitizedCode);
      
      if (result.user) {
        resetRateLimit(identifier); // Reset rate limit on successful verification
        
        logSecurityEvent({
          type: 'auth',
          status: 'success',
          details: 'Phone authentication successful',
          identifier: result.user.uid
        });

        // Clear all phone-related data before login
        setPhoneNumber('');
        setVerificationCode('');
        setConfirmationResult(null);

        login(result.user.uid);
        router.push('/ges-workbench/dashboard');
      }
    } catch (err: any) {
      logSecurityEvent({
        type: 'auth',
        status: 'failure',
        details: `Phone verification failed: ${err.message}`,
        identifier
      });
      setError(err.message || 'Invalid verification code');
      console.error('Phone verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
          Phone number
        </label>
        <div className="mt-1 flex">
          <button
            type="button"
            onClick={() => setShowCountryList(!showCountryList)}
            className="relative flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-700"
          >
            <span>{selectedCountry.dialCode}</span>
            <span className="ml-2">▼</span>
          </button>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="block w-full rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter phone number"
            disabled={isLoading || !!confirmationResult}
            autoComplete="off"
          />
        </div>
        {showCountryList && (
          <div className="absolute mt-1 w-48 rounded-md bg-white border border-gray-300 shadow-lg z-50 max-h-48 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <span className="mr-2">{country.flag}</span>
                <span>{country.dialCode}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {confirmationResult ? (
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-600">
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter verification code"
            disabled={isLoading}
            maxLength={6}
            pattern="\d{6}"
            autoComplete="off"
          />
        </div>
      ) : null}

      {error && (
        <div className={`p-3 rounded text-sm ${
          error.includes('successfully') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {error}
        </div>
      )}

      <button
        onClick={confirmationResult ? handleVerifyCode : handleSendCode}
        disabled={isLoading || (!confirmationResult && !phoneNumber)}
        className="w-full py-2 px-4 bg-[#6366F1] text-white rounded-md font-medium hover:bg-[#5558E3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? (
          "Processing..."
        ) : confirmationResult ? (
          "Verify Code"
        ) : (
          "Send OTP"
        )}
      </button>

      <div id="recaptcha-container" className="mt-4"></div>
    </div>
  );
} 