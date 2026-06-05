"use client";

import PageTitle from "@/components/page-title";
import UserProfileCard from "@/components/user-profile-card";
import { useUsersStore } from "@/store/users-store";
import React from "react";

function CustomerProfilePage() {
  const { loggedInUser } = useUsersStore();

  if (!loggedInUser) {
    return (
      <div>
        <PageTitle title="Profile" />
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="My Profile" />
      <div className="mt-8 grid grid-cols-1 gap-6">
        <UserProfileCard user={loggedInUser} />
      </div>
    </div>
  );
}

export default CustomerProfilePage;
