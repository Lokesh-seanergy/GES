"use client";

import React, { useState } from "react";
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
  // Track sidebar expanded state
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex flex-row h-screen overflow-hidden">
      {/* Side Menu */}
      <Sidemenu expanded={expanded} setExpanded={setExpanded} />
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
