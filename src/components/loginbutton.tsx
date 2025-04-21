"use client";

import Image from "next/image";

export default function LoginButtons() {
  const handleGoogleSignIn = () => {
    // This is the real Google OAuth login URL
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded"
    >
      <Image
        src="/ges-workbench/google.png"
        alt="Google"
        width={20}
        height={20}
        unoptimized
      />
      <span className="text-gray-700">Sign In With Google</span>
    </button>
  );
}
