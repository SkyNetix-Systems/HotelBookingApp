"use client";

import React from "react";
import { IUser } from "@/interfaces";

interface UserProfileCardProps {
  user: IUser;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return { bg: "bg-purple-50", text: "text-purple-700", icon: "👑" };
      case "owner":
        return { bg: "bg-blue-50", text: "text-blue-700", icon: "🏨" };
      case "customer":
        return { bg: "bg-green-50", text: "text-green-700", icon: "👤" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", icon: "👥" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          badge: "✓ Active",
        };
      case "inactive":
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          badge: "○ Inactive",
        };
      case "suspended":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          badge: "⊘ Suspended",
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", badge: status };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const roleInfo = getRoleColor(user.role);
  const statusInfo = getStatusColor(user.status);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
      {/* Header with gradient background */}
      <div className={`${roleInfo.bg} p-6 border-b-4 border-gray-200`}>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{roleInfo.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className={`text-sm font-semibold ${roleInfo.text} capitalize`}>
              {user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Grid layout with 5 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
        {/* Column 1: Email */}
        <div className="p-6 border-b lg:border-b lg:border-r border-gray-200">
          <span className="text-3xl mb-3 block">✉️</span>
          <p className="text-xs text-gray-600 font-medium tracking-wide uppercase mb-2">Email</p>
          <p className="text-gray-900 font-semibold break-all text-sm">{user.email}</p>
        </div>

        {/* Column 2: Status */}
        <div className="p-6 border-b lg:border-b lg:border-r border-gray-200">
          <span className="text-3xl mb-3 block">🔔</span>
          <p className="text-xs text-gray-600 font-medium tracking-wide uppercase mb-2">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
          >
            {statusInfo.badge}
          </span>
        </div>

        {/* Column 3: User ID */}
        <div className="p-6 border-b lg:border-b lg:border-r border-gray-200">
          <span className="text-3xl mb-3 block">🔑</span>
          <p className="text-xs text-gray-600 font-medium tracking-wide uppercase mb-2">User ID</p>
          <p className="text-gray-900 font-semibold text-sm">{user.id}</p>
        </div>

        {/* Column 4: Member Since */}
        <div className="p-6 border-b lg:border-b lg:border-r border-gray-200">
          <span className="text-3xl mb-3 block">📅</span>
          <p className="text-xs text-gray-600 font-medium tracking-wide uppercase mb-2">Member Since</p>
          <p className="text-gray-900 font-semibold text-sm">{formatDate(user.created_at)}</p>
        </div>

        {/* Column 5: Account Type */}
        <div className="p-6 border-b lg:border-b border-gray-200">
          <span className="text-3xl mb-3 block">📋</span>
          <p className="text-xs text-gray-600 font-medium tracking-wide uppercase mb-2">Account Type</p>
          <p className="text-gray-900 font-semibold text-sm capitalize">
            {user.role === "customer"
              ? "Customer"
              : user.role === "owner"
              ? "Owner"
              : "Admin"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;