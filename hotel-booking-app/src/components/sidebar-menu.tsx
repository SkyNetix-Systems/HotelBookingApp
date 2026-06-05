"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUsersStore } from "@/store/users-store";
import LogoutButton from "@/components/logout-button";
import {
  Home,
  User,
  Settings,
  LogOut,
  Building,
  Calendar,
  DoorOpen,
  LayoutDashboard,
  Users,
  UserSquare,
} from "lucide-react";

interface SidebarMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function SidebarMenu({ isOpen, onOpenChange }: SidebarMenuProps) {
  const { loggedInUser } = useUsersStore();
  const pathname = usePathname();
  const router = useRouter();

  const iconSize = 16;

  const customerMenuItems = [
    {
      title: "Dashboard",
      path: "/customer/dashboard",
      icon: <LayoutDashboard size={iconSize} />,
    },
    {
      title: "Book a Room",
      path: "/customer/book-room",
      icon: <Home size={iconSize} />,
    },
    {
      title: "Bookings",
      path: "/customer/bookings",
      icon: <Calendar size={iconSize} />,
    },
    {
      title: "Profile",
      path: "/customer/profile",
      icon: <UserSquare size={iconSize} />,
    },
  ];

  const ownerMenuItems = [
    {
      title: "Dashboard",
      path: "/owner/dashboard",
      icon: <LayoutDashboard size={iconSize} />,
    },
    {
      title: "Hotels",
      path: "/owner/hotels",
      icon: <Building size={iconSize} />,
    },
    {
      title: "Rooms",
      path: "/owner/rooms",
      icon: <DoorOpen size={iconSize} />,
    },
    {
      title: "Bookings",
      path: "/owner/bookings",
      icon: <Calendar size={iconSize} />,
    },
    {
      title: "Profile",
      path: "/owner/profile",
      icon: <UserSquare size={iconSize} />,
    },
  ];

  const adminMenuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={iconSize} />,
    },
    {
      title: "Hotels",
      path: "/admin/hotels",
      icon: <Building size={iconSize} />,
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: <Users size={iconSize} />,
    },
  ];

  let menuItems: Array<{
    title: string;
    path: string;
    icon: React.ReactNode;
  }> = [];
  if (loggedInUser?.role === "customer") {
    menuItems = customerMenuItems;
  } else if (loggedInUser?.role === "owner") {
    menuItems = ownerMenuItems;
  } else if (loggedInUser?.role === "admin") {
    menuItems = adminMenuItems;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <SheetTitle className="text-left text-lg font-semibold text-gray-900">
              Menu
            </SheetTitle>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  router.push(item.path);
                  onOpenChange(false);
                }}
                className={`text-gray-700  hover:bg-gray-50 w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  item.path === pathname
                    ? "bg-gray-100 border border-gray-400 text-blue-900"
                    : "border-0"
                }`}
              >
                <span className="text-gray-600">{item.icon}</span>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 p-4">
            <LogoutButton className="w-full bg-primary hover:bg-[#0d2f38] text-white border-0">
              <LogOut size={18} className="mr-2" />
              Logout
            </LogoutButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SidebarMenu;
