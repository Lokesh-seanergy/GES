"use client";

import React from "react";
import Sidemenu from "./Sidemenu";
import Header from "./Header";
import type { BreadcrumbItem } from "./Breadcrumb";
import Breadcrumb from "./Breadcrumb";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

interface MainLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function MainLayout({
  children,
  breadcrumbs = [],
}: MainLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Side Menu */}
      <div className="hidden md:block">
        <Sidemenu />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f0f1f5] relative">
          {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
          {children}
          <ScrollToTop />
        </main>
      </div>
    </div>
  );
}
