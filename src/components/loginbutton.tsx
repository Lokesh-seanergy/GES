'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn('auth0')}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-md"
    >
      <Image
        src="/ges-workbench/google.png"
        alt="Google"
        width={20}
        height={20}
        unoptimized
      />
      <span className="text-gray-700">Sign In with Google (via Auth0)</span>
    </button>
  );
}
