"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const MOCK_CREDENTIALS = {
  email: "test@example.com",
  password: "password123"
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

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
      await new Promise((res) => setTimeout(res, 1000)); // simulate API

      if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
        login("mock-token");
        router.push("/ges-workbench/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = () => {
    login("mock-microsoft-token");
    router.push("/ges-workbench/dashboard");
  };



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
            onClick={handleMicrosoftSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            <Image src="/ges-workbench/microsoft.png" alt="Microsoft" width={20} height={20} />
            <span className="text-gray-700">Sign In With Microsoft</span>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
          >
            {isLoading ? "Logging in..." : "Sign In With Email"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          We’ll email you a magic code for a password-free sign in.
        </p>

       
      </div>
    </div>
  );
}
