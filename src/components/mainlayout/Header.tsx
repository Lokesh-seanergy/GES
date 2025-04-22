"use client";

import React from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Roboto } from "next/font/google";
import { SearchBar } from "../ui/SearchBar";
import Image from "next/image";

// Configure the Roboto font with specific weights
const roboto = Roboto({
  weight: ["300", "400"],
  subsets: ["latin"],
  display: "swap",
});

export default function Header() {
  return (
    <header className="bg-white shadow-sm px-6 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <h1
          className={`${roboto.className} text-[26px] leading-[100%] tracking-[0%] ml-8`}
        >
          <span className="font-[300] ">Welcome To </span>
          <span className="font-[400] ">WorkBench</span>
        </h1>
      </div>

      <div className="flex items-center">
        {/* Search Bar */}
        <div className="mr-8">
          <SearchBar placeholder="Search Here..." className="w-64" />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-blue-600 mr-2">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-4 w-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">
            2
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <div className="h-8 w-8 rounded-full overflow-hidden relative">
            <Image
              src="/ges-workbench/profile.png" // Update this path to your actual image
              alt="User profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-medium">Jesse Rose</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <button className="text-gray-500">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
