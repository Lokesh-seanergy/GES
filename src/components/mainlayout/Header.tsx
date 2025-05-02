"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { Roboto } from "next/font/google";
import { SearchBar } from "../ui/SearchBar";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useNotifications } from "../NotificationContext";
import { usePathname } from "next/navigation";

// Configure the Roboto font with specific weights
const roboto = Roboto({
  weight: ["300", "400"],
  subsets: ["latin"],
  display: "swap",
});

export default function Header() {
  const { logout, userProfile } = useAuthStore();
  const { notifications, setNotifications } = useNotifications();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const bellRef = useRef(null);
  const profileRef = useRef(null);
  const pathname = usePathname();

  // Add effect to close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Notification dropdown
      if (showNotificationDropdown && bellRef.current && !(bellRef.current as any).contains(event.target)) {
        setShowNotificationDropdown(false);
      }
      // Profile dropdown
      if (isProfileOpen && profileRef.current && !(profileRef.current as any).contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationDropdown, isProfileOpen]);

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
    : '/GES/profile.png';
  const role = 'Admin'; // This could come from a role management system

  const handleImageError = () => {
    setImageError(true);
  };

  // Mark notification as read
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, status: "read" } : n
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        n.status === "pending" ? { ...n, status: "read" } : n
      )
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 h-16 flex items-center px-8 justify-between">
      {/* Left: Logo & App Name */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-blue-800 tracking-tight">Show Workbench</span>
      </div>

      {/* Right: Search Bar, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {pathname === "/dashboard" && <SearchBar className="w-64" />}
        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            className="relative h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 shadow transition-all duration-200 focus:outline-none"
            aria-label="Show notifications"
            role="button"
            onClick={() => setShowNotificationDropdown((prev) => !prev)}
          >
            <Bell size={22} />
            {notifications.filter(n => n.status === "pending").length > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow ring-2 ring-white">
                {notifications.filter(n => n.status === "pending").length}
              </span>
            )}
          </button>
          {showNotificationDropdown && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 font-semibold border-b bg-gray-50">
                <span>Notifications</span>
                <button
                  className="text-xs text-blue-600 hover:underline"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.filter(n => n.status === "pending" || n.status === "read").length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                    <Bell className="w-8 h-8 mb-2" />
                    <span>No new notifications</span>
                  </div>
                ) : (
                  notifications
                    .filter(n => n.status === "pending" || n.status === "read")
                    .map((note) => (
                      <div
                        key={note.id}
                        className={`flex items-start gap-3 p-4 border-b last:border-b-0 transition
                          ${note.status === "pending" ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-gray-50"}
                          cursor-pointer`}
                        onClick={() => markNotificationAsRead(note.id)}
                      >
                        {note.status === "pending" && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className={`font-semibold ${note.status === "pending" ? "text-blue-900" : "text-gray-700"}`}>{note.task}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            <b>Zone:</b> {note.boothZone} | <b>Customer:</b> {note.customerName}
                          </div>
                        </div>
                        {/* Optionally, add a timestamp here */}
                        {/* <span className="text-xs text-gray-400 ml-2">{formatTimeAgo(note.timestamp)}</span> */}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
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
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-4 z-50 overflow-hidden border border-gray-100">
              {/* User Info */}
              <div className="flex items-center gap-3 px-5 pb-4 border-b border-gray-100">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {imageError && !photoURL.startsWith('/') ? (
                    <User className="text-gray-500" size={28} />
                  ) : (
                    <Image
                      src={photoURL}
                      alt="User profile"
                      width={48}
                      height={48}
                      className="object-cover"
                      onError={handleImageError}
                      unoptimized={photoURL.startsWith('https://')}
                    />
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{displayName}</div>
                  <div className="text-xs text-gray-500">{email}</div>
                  <div className="text-xs text-blue-600 font-semibold">{role}</div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col py-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2 text-sm text-red-600 hover:bg-red-50 transition font-semibold"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
