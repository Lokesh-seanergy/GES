"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Root page component that handles authentication and redirection
 */
export default function Home() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      router.replace('/GES/login');
    } else {
      router.replace('/GES/dashboard');
    }
  }, [router, checkAuth]);

  // Show nothing while redirecting
  return null;
}
