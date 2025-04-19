"use client";

import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm mb-4">
      <ol className="flex items-center">
        <li>
          <Link
            href="/"
            className="text-blue-500 hover:underline flex items-center"
          >
            <Home size={14} className="mr-1" />
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            {item.href ? (
              <Link href={item.href} className="text-blue-500 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
