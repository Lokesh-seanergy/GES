"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  // Redirect to dashboard when hitting the not-found page
  useEffect(() => {
    console.log("Not found page - redirecting to dashboard...");
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
      <p>Taking you to the dashboard</p>
    </div>
  );
}
