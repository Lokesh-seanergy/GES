"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { handleSocialLogin } from "@/lib/auth/socialAuth";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (checkAuth()) {
      router.replace("/ges-workbench/dashboard");
    }
  }, [checkAuth, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login("dummy-token");
      router.replace("/ges-workbench/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[450px] mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-8 mb-8">
          <div className="flex-1 text-center">
            <Image
              src="/ges_logo.png"
              alt="GES Logo"
              width={180}
              height={180}
              className="mx-auto"
            />
            <h1 className="text-[40px] font-bold text-[#2D3748] mt-4">GES</h1>
          </div>
          {/* Vertical Line */}
          <div className="w-[1px] h-[200px] bg-gray-200"></div>
          {/* Right Side Content */}
          <div className="flex-1">
            <h2 className="text-[32px] font-bold text-[#2D3748] mb-2">Sign in to GES</h2>
            <p className="text-gray-600 text-sm mb-6">
              We suggest using the email address you use at work.
            </p>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('microsoft')}
                className="w-full flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-[20px] hover:bg-gray-50"
              >
                <Image
                  src="/ges-workbench/microsoft.png"
                  alt="Microsoft"
                  width={20}
                  height={20}
                />
                <span className="text-gray-700 text-sm">Sign In With Microsoft</span>
              </button>

              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-[20px] hover:bg-gray-50"
              >
                <Image
                  src="/ges-workbench/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span className="text-gray-700 text-sm">Sign In With Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('apple')}
                className="w-full flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-[20px] hover:bg-gray-50"
              >
                <Image
                  src="/ges-workbench/apple.png"
                  alt="Apple"
                  width={20}
                  height={20}
                />
                <span className="text-gray-700 text-sm">Sign In With Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-[20px] focus:outline-none focus:border-[#3182CE]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-[20px] focus:outline-none focus:border-[#3182CE]"
              />
              
              <div className="flex items-center justify-between mt-2">
                <Link href="/forgot-password" className="text-[#3182CE] text-sm hover:underline">
                  Forget Password?
                </Link>
                <button
                  type="submit"
                  className="bg-[#3182CE] text-white px-8 py-2 text-sm rounded-[20px] hover:bg-blue-600"
                >
                  LOGIN
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#3182CE] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 