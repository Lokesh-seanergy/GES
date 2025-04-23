"use client";

import React, { useState } from "react";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { Roboto } from "next/font/google";
import { SearchBar } from "../ui/SearchBar";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";

// Configure the Roboto font with specific weights
const roboto = Roboto({
  weight: ["300", "400"],
  subsets: ["latin"],
  display: "swap",
});

export default function Header() {
  const { logout, userProfile } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    try {
      setIsProfileOpen(false);
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Default values if no profile is available
  const displayName = userProfile?.displayName || 'Jesse Rose';
  const email = userProfile?.email || 'jesse@example.com';
  const photoURL = !imageError && userProfile?.photoURL 
    ? userProfile.photoURL 
    : '/ges-workbench/profile.png';
  const role = 'Admin'; // This could come from a role management system

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <header className="bg-white shadow-sm px-6 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <h1
          className={`${roboto.className} text-[26px] leading-[100%] tracking-[0%] ml-8`}
        >
          <span className="font-[400] ">ShowFlow</span>
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

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center gap-2 border-l pl-4 ml-2"
          >
            <div className="h-8 w-8 rounded-full overflow-hidden relative">
              {imageError && !photoURL.startsWith('/') ? (
                <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                  <User className="text-gray-500" size={16} />
                </div>
              ) : (
              <Image
                  src={photoURL}
                alt="User profile"
                fill
                className="object-cover"
                  onError={handleImageError}
                  unoptimized={photoURL.startsWith('https://')}
              />
              )}
            </div>
            <div className="text-sm">
              <p className="font-medium">{displayName}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
            <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
