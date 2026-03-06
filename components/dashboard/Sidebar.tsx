"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, UserPlus, Building2, UserCog } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ currentPage, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Visitor Management", href: "/dashboard/visitor-management", icon: Users },
    { name: "Room Management", href: "/dashboard/room-management", icon: Building2 },
    { name: "User Management", href: "/dashboard/user-management", icon: UserCog },
  ];

  const visitorMenuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Visits", href: "/dashboard/myvisit", icon: UserPlus },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : visitorMenuItems;

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-40 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Visitor System
          </h1>
          <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                <Icon className="w-5 h-5" />
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mb-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="w-full justify-start gap-2 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl font-medium">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
