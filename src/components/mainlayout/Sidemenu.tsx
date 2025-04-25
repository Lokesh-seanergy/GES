"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
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
  // Sidebar is expanded by default on dashboard, collapsed otherwise
  const isDashboard = pathname === "/dashboard";
  const [isCollapsed, setIsCollapsed] = useState(!isDashboard);
  const [isHovered, setIsHovered] = useState(false);

  // Sidebar is expanded if hovered or always on dashboard
  const expanded = isDashboard || isHovered;

  // Collapse sidebar when menu item is clicked (except dashboard)
  const handleMenuClick = (href: string) => {
    if (href !== "/dashboard") {
      setIsCollapsed(true); // This line is now redundant but kept for future click-collapse if needed
    }
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
      className={`h-screen ${expanded ? "w-56" : "w-16"} text-white flex flex-col transition-all duration-300 overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: !expanded && !isDashboard ? 'pointer' : 'default' }}
    >
      {/* Logo section */}
      <div className={`relative bg-[#88c5cf] w-full h-16 p-0 m-0 flex items-center justify-center overflow-hidden transition-all duration-300`}> 
        <img
          src={expanded ? "/ges-workbench/ges_logo.png" : "/ges-workbench/geslogo.png"}
          alt="GES Logo"
          className={expanded ? "w-full h-full object-cover" : "h-10 w-10 rounded-full object-cover border-2 border-white shadow"}
          style={{ display: 'block', transition: 'all 0.3s' }}
        />
      </div>
      {/* Menu items with dark blue background */}
      <nav className="bg-[#07334b] flex-grow">
        <ul className="w-full">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li
                key={item.id}
                className={`border-b border-[#07334b] ${isActive ? "bg-[#0a4763]" : ""}`}
              >
                <Link
                  href={item.href}
                  className={`flex items-center h-14 ${expanded ? "px-6" : "justify-center"} text-white hover:bg-[#0a4763] transition-colors`}
                  title={!expanded ? item.label : ""}
                  onClick={() => handleMenuClick(item.href)}
                >
                  <span className="flex items-center justify-center min-w-[24px]">
                    {item.icon}
                  </span>
                  <span
                    className={`ml-3 font-medium text-sm transition-opacity duration-300 whitespace-nowrap ${!expanded ? "opacity-0 w-0" : "opacity-100 w-auto"}`}
                  >
                    {item.label}
                  </span>
                  {item.hasChildren && expanded && (
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
