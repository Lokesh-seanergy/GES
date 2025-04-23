"use client";

import React from "react";
import type { ReactNode } from "react";
import Sidemenu from "./Sidemenu";
import Header from "./Header";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface MainLayoutProps {
  children: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  breadcrumbClassName?: string;
}

export default function MainLayout({
  children,
  breadcrumbs,
  breadcrumbClassName,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Side Menu */}
      <Sidemenu />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="sticky top-0 z-10">
          <div
            className={cn(
              "flex items-center flex-wrap gap-2 px-6 bg-white border-b border-gray-200 shadow-sm",
              breadcrumbClassName
            )}
          >
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center whitespace-nowrap">
                {index > 0 && (
                  <span className="mx-2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
                {item.href || item.onClick ? (
                  <button
                    onClick={
                      item.onClick ||
                      (() => (window.location.href = item.href!))
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors truncate max-w-[300px]"
                    title={item.label}
                  >
                    {item.label}
                  </button>
                ) : (
                  <span
                    className="text-gray-700 font-semibold truncate max-w-[300px]"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <main className="flex-1 overflow-auto p-6 bg-[#f0f1f5]">
          {children}
        </main>
      </div>
    </div>
  );
}
