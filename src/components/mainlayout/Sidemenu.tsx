"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
  Image as ImageIcon,
  Users,
  BarChart,
  Settings,
  ChevronRight,
  Menu,
  ShoppingCart,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  hasChildren?: boolean;
}

export default function Sidemenu() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "DASHBOARD",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard",
    },
    {
      id: "shows",
      label: "SHOWS",
      icon: <Ticket size={20} />,
      href: "/shows",
    },
    {
      id: "orders",
      label: "ORDERS",
      icon: <ShoppingCart size={20} />,
      href: "/orders",
    },
    // {
    //   id: "exhibits",
    //   label: "EXHIBITS",
    //   icon: <ImageIcon size={20} />,
    //   href: "/exhibits",
    //   hasChildren: true,
    // },
    {
      id: "customers",
      label: "EXHIBITORS",
      icon: <Users size={20} />,
      href: "/customers",
      hasChildren: true,
    },
    {
      id: "reports",
      label: "REPORTS",
      icon: <BarChart size={20} />,
      href: "/reports",
      hasChildren: true,
    },
    {
      id: "settings",
      label: "SETTINGS",
      icon: <Settings size={20} />,
      href: "/settings",
    },
  ];

  return (
    <aside
      className={`h-screen ${
        isCollapsed ? "w-16" : "w-56"
      } text-white flex flex-col transition-all duration-300 overflow-hidden`}
    >
      {/* Logo section with light blue background */}
      <div
        className={`h-16 flex items-center bg-[#88c5cf] transition-all duration-300 ${
          isCollapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        <div
          className={`flex items-center h-full overflow-hidden ${
            isCollapsed ? "w-full justify-center" : ""
          }`}
        >
          <div className="flex items-center justify-center">
            <Image
              src="/ges-workbench/ges_logo.png"
              alt="GES Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div
            className={`ml-2 whitespace-nowrap transition-all duration-300 ${
              isCollapsed
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100 w-auto"
            }`}
          >
            <span className="text-[#07334b] font-bold text-xl">GES</span>
          </div>
        </div>
        <button
          className={`text-black transition-all duration-300 ${
            isCollapsed
              ? "opacity-0 w-0 overflow-hidden absolute"
              : "opacity-100 w-auto relative"
          }`}
          onClick={toggleSidebar}
          aria-label="Collapse menu"
        >
          <Menu size={24} />
        </button>
        {isCollapsed && (
          <button
            className="absolute left-0 top-0 w-16 h-16 opacity-0"
            onClick={toggleSidebar}
            aria-label="Expand menu"
          />
        )}
      </div>

      {/* Menu items with dark blue background */}
      <nav className="bg-[#07334b] flex-grow">
        <ul className="w-full">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <li
                key={item.id}
                className={`border-b border-[#07334b] ${
                  isActive ? "bg-[#0a4763]" : ""
                }`}
              >
                <Link
                  href={item.href}
                  className={`flex items-center h-14 ${
                    isCollapsed ? "justify-center" : "px-6"
                  } text-white hover:bg-[#0a4763] transition-colors`}
                  title={isCollapsed ? item.label : ""}
                >
                  <span className="flex items-center justify-center min-w-[24px]">
                    {item.icon}
                  </span>
                  <span
                    className={`ml-3 font-medium text-sm transition-opacity duration-300 whitespace-nowrap ${
                      isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.hasChildren && !isCollapsed && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
