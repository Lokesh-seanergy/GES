"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Root page component that automatically redirects to the dashboard
 * This ensures users always land on the dashboard when accessing the root URL
 */
export default function Home() {
  const router = useRouter();

  // Force immediate redirect on component mount
  useEffect(() => {
    console.log("Redirecting to dashboard...");
    router.push("/dashboard");
  }, [router]);

  // This will be rendered briefly before redirection happens
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to GES WorkBench</h1>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
