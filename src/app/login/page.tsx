"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useMsalAuth } from "@/hooks/useMsalAuth";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const { handleMicrosoftLogin } = useMsalAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo credentials
    if (email === "demo@example.com" && password === "demo123") {
      login("demo-token");
      window.location.href = "/ges-workbench/dashboard";
    } else {
      setError("Invalid credentials. Use demo@example.com / demo123");
    }
  };

  return (
    <MsalProvider instance={msalInstance}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-[800px] w-full bg-white shadow-lg rounded-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Logo and SHOWFLOW */}
              <div className="flex flex-col items-center space-y-4 md:w-1/2">
                <Image
                  src="/ges-workbench/ges_logo.png"
                  alt="GES Logo"
                  width={120}
                  height={120}
                  priority
                />
                <h1 className="text-4xl font-bold text-gray-900">SHOWFLOW</h1>
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block w-px bg-gray-200 self-stretch" />

              {/* Login Form */}
              <div className="flex flex-col space-y-6 md:w-1/2">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
                  <p className="mt-2 text-sm text-gray-600">Sign in to continue to your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign in with Email
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMicrosoftLogin}
                  className="w-full"
                >
                  <Image
                    src="/ges-workbench/microsoft.png"
                    alt="Microsoft"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Sign in with Microsoft
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Demo credentials: demo@example.com / demo123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MsalProvider>
  );
}
