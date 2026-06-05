"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "@/actions/users";
import PageTitle from "@/components/page-title";
import InfoMessage from "@/components/info-message";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser } from "@/interfaces";
import { getDateTimeFormat, getUserRoleColor } from "@/helpers";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers();
        if (result.success && result.data) {
          setUsers(result.data);
        } else {
          setError(result.message || "Failed to fetch users");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async (newRole: string, userId: number) => {
    setUpdatingId(userId);
    try {
      const result = await updateUserRole(userId, newRole);

      if (result.success) {
        // Update local state
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success("User role updated successfully");
      } else {
        toast.error(result.message || "Failed to update user role");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while updating the user role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageTitle title="All Users" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : users.length === 0 ? (
          <InfoMessage message="No users found." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(value, user.id)}
                      disabled={updatingId === user.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status?.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{getDateTimeFormat(user.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;