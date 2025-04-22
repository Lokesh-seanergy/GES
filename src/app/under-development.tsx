"use client";

import React from "react";
import { Construction } from "lucide-react"; // Using Lucide icon for construction

export default function UnderDevelopment() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <Construction size={100} className="text-yellow-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Page Under Development</h1>
      <p className="text-gray-600 text-lg max-w-md text-center">
        We're currently working on this section of the application. Please check
        back later for updates.
      </p>
    </div>
  );
}
