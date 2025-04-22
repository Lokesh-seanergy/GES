"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { isMFAEnabled } from "@/lib/firebase/mfa";
import MFAVerification from "@/components/auth/MFAVerification";
import PhoneAuth from "@/components/auth/PhoneAuth";
import {
  checkRateLimit, 
  getRemainingAttempts, 
  resetRateLimit, 
  validatePassword, 
  checkSecurityFeatures, 
  sanitizeInput, 
  logSecurityEvent,
  RATE_LIMIT_WINDOW 
} from "@/lib/auth/security";
import Cookies from 'js-cookie';

type AuthMethod = 'email' | 'phone' | 'social';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AuthMethod>('email');

  const { login } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check security features on mount
    const features = checkSecurityFeatures();
    if (!features.cookiesEnabled || !features.localStorageAvailable) {
      setError("Please enable cookies and local storage to continue");
      return;
    }
    if (!features.secureContextAvailable) {
      setError("This application requires a secure context (HTTPS)");
      return;
    }

    // Load saved email
    const savedEmail = localStorage.getItem('lastLoginEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    logSecurityEvent({
      type: 'security-check',
      status: 'success',
      details: 'Security features verified'
    });
  }, []);

  const handleGoogleSignIn = async () => {
    const identifier = 'google-auth'; // In production, use IP or session ID
    if (checkRateLimit(identifier)) {
      const remaining = getRemainingAttempts(identifier);
      setError(`Too many attempts. Please try again in ${Math.ceil(RATE_LIMIT_WINDOW / 60000)} minutes.`);
      logSecurityEvent({
        type: 'rate-limit',
        status: 'failure',
        details: 'Google auth rate limit exceeded',
        identifier
      });
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      resetRateLimit(identifier); // Reset on success
      
      // Check if MFA is required
      const mfaEnabled = await isMFAEnabled(user);
      if (mfaEnabled) {
        setCurrentUser(user);
        setShowMFA(true);
        return;
      }

      logSecurityEvent({
        type: 'auth',
        status: 'success',
        details: 'Google authentication successful',
        identifier: user.uid
      });

      // If no MFA required, proceed with login
      login(user.uid);
      router.push("/ges-workbench/dashboard");
    } catch (error: any) {
      logSecurityEvent({
        type: 'auth',
        status: 'failure',
        details: `Google auth failed: ${error.message}`,
        identifier
      });
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedEmail && !sanitizedPassword) {
      setError("Email and password are required");
      return false;
    }
    if (!sanitizedEmail) {
      setError("Email is required");
      return false;
    }
    if (!sanitizedPassword) {
      setError("Password is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      setError("Please enter a valid email address");
      return false;
    }

    const passwordValidation = validatePassword(sanitizedPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const identifier = email.toLowerCase(); // Use email as rate limit identifier
    if (checkRateLimit(identifier)) {
      const remaining = getRemainingAttempts(identifier);
      setError(`Too many attempts. Please try again in ${Math.ceil(RATE_LIMIT_WINDOW / 60000)} minutes.`);
      logSecurityEvent({
        type: 'rate-limit',
        status: 'failure',
        details: 'Email auth rate limit exceeded',
        identifier
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);
      
      const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, sanitizedPassword);
      const user = userCredential.user;
      
      resetRateLimit(identifier); // Reset on success
      
      // Check if MFA is required
      const mfaEnabled = await isMFAEnabled(user);
      if (mfaEnabled) {
        setCurrentUser(user);
        setShowMFA(true);
        return;
      }

      logSecurityEvent({
        type: 'auth',
        status: 'success',
        details: 'Email authentication successful',
        identifier: user.uid
      });

      // If no MFA required, proceed with login
      login(user.uid);
      localStorage.setItem('lastLoginEmail', sanitizedEmail);
      router.push("/ges-workbench/dashboard");
    } catch (error: any) {
      logSecurityEvent({
        type: 'auth',
        status: 'failure',
        details: `Email auth failed: ${error.message}`,
        identifier
      });
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAComplete = () => {
    if (currentUser) {
      login(currentUser.uid);
      router.push("/ges-workbench/dashboard");
    }
  };

  if (showMFA && currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
          <MFAVerification user={currentUser} onComplete={handleMFAComplete} />
        </div>
      </div>
    );
  }

  const renderEmailForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-50 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter email address"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-50 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter password"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-[#6366F1] text-white rounded-md font-medium hover:bg-[#5558E3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );

  const renderSocialButtons = () => (
    <div className="space-y-4">
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Image
          src="/ges-workbench/google.png"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        Sign In With Google
      </button>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/expoges)',
          filter: 'brightness(0.7)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image src="/ges-workbench/ges_logo.png" alt="GES Logo" width={80} height={80} priority />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SHOWFLOW</h1>
              <p className="mt-2 text-sm text-gray-500">
                We suggest using the email address you use at work.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'email'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('email')}
              >
                Email
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'phone'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('phone')}
              >
                Phone
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'social'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('social')}
              >
                Social
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            {activeTab === 'email' && renderEmailForm()}
            {activeTab === 'phone' && <PhoneAuth />}
            {activeTab === 'social' && renderSocialButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}
