// app/ges-workbench/login/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
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
      // Normally you would do real sign-in logic here
      login("mock-email-user", { displayName: "Email User", email });
      router.push("/ges-workbench/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setIsLoading(true);
      login("mock-microsoft-user", { displayName: "Microsoft User", email: "microsoftuser@example.com" });
      router.push("/ges-workbench/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-[800px] w-full bg-white shadow-lg rounded-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Logo Section */}
            <div className="flex flex-col items-center space-y-4 md:w-1/2">
              <Image
                src="/ges-workbench/ges_logo.png"
                alt="GES Logo"
                width={250}
                height={250}
                priority
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200 self-stretch" />

            {/* Login Form */}
            <div className="flex-1 w-full md:w-1/2 space-y-8">
              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />

                {error && <div className="text-sm text-red-600">{error}</div>}

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
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleMicrosoftSignIn}
                disabled={isLoading}
                className="w-full"
              >
                <Image
                  src="/ges-workbench/microsoft.png"
                  alt="Microsoft"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Continue with Microsoft
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
