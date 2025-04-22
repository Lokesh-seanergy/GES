"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { isMFAEnabled } from "@/lib/firebase/mfa";
import MFAVerification from "@/components/auth/MFAVerification";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { login } = useAuthStore();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if MFA is required
      const mfaEnabled = await isMFAEnabled(user);
      if (mfaEnabled) {
        setCurrentUser(user);
        setShowMFA(true);
        return;
      }

      // If no MFA required, proceed with login
      login(user.uid);
      router.push("/ges-workbench/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!email && !password) {
      setError("Email and password are required");
      return false;
    }
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if MFA is required
      const mfaEnabled = await isMFAEnabled(user);
      if (mfaEnabled) {
        setCurrentUser(user);
        setShowMFA(true);
        return;
      }

      // If no MFA required, proceed with login
      login(user.uid);
      router.push("/ges-workbench/dashboard");
    } catch (error: any) {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex justify-center">
          <Image src="/ges-workbench/ges_logo.png" alt="GES Logo" width={80} height={80} />
        </div>
        <div>
          <h1 className="text-center text-2xl font-bold text-gray-900">SHOWFLOW</h1>
          <p className="text-center text-gray-500 mt-1">
            We suggest using the email address you use at work.
          </p>
        </div>

        {/* Social Sign In */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <Image src="/ges-workbench/google.png" alt="Google" width={20} height={20} />
            <span className="text-gray-700">
              {isLoading ? "Signing in..." : "Sign In With Google"}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Enter your work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors disabled:bg-blue-400"
          >
            {isLoading ? "Logging in..." : "Sign In With Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
