"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { auth } from "@/lib/firebase/config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      login(userCredential.user.uid);
      router.push("/ges-workbench/dashboard");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError(error.message || "Failed to sign in");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Starting Google sign-in process...");

      // Create Google provider with prompt='select_account' to force account selection
      const provider = new GoogleAuthProvider();

      // Add prompt parameter to force account selection every time
      provider.setCustomParameters({
        prompt: "select_account",
      });

      console.log("Initialized Google provider, opening popup...");

      // Use a more robust approach with error handling
      const result = await signInWithPopup(auth, provider).catch((error) => {
        console.error("Error during sign-in popup:", error);
        throw error;
      });

      console.log("Sign-in successful, extracting user profile...");

      // Extract user profile data
      const userProfile = {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };

      console.log("User profile:", userProfile);

      // Pass both the token and user profile to the login function
      login(result.user.uid, userProfile);

      console.log("Redirecting to orders page...");
      router.push("/ges-workbench/dashboard");
    } catch (error: unknown) {
      console.error("Google sign-in failed:", error);
      if (error instanceof FirebaseError) {
        setError(error.message || "Failed to sign in with Google");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            <div className="flex-1 w-full md:w-1/2 space-y-8">
              <div className="text-center"></div>

              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div key={error} className="text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in with Email"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                <Image
                  src="/ges-workbench/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Sign in with Google
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
