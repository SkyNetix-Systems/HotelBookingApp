"use client";

import PageTitle from "@/components/page-title";
import DashboardCard from "@/components/dashboard-card";
import Spinner from "@/components/spinner";
import { useUsersStore } from "@/store/users-store";
import { getAdminDashboardData } from "@/actions/dashboard";
import { getDateFormat } from "@/helpers";
import React, { useEffect, useState } from "react";
import { IBooking } from "@/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardData {
  totalUsers: number;
  totalOwners: number;
  totalCustomers: number;
  totalHotels: number;
  totalRooms: number;
  totalBookings: number;
  upcomingBookings: number;
  totalRevenue: number;
  recentBookings: IBooking[];
}

function AdminDashboard() {
  const { loggedInUser } = useUsersStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!loggedInUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getAdminDashboardData();

        if (!response.success || !response.data) {
          setError(response.message || "Failed to fetch dashboard data");
          return;
        }

        setDashboardData(response.data);
      } catch (err) {
        setError("An error occurred while fetching dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [loggedInUser]);

  if (!loggedInUser) {
    return (
      <div>
        <PageTitle title="Dashboard" />
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageTitle title="Dashboard" />
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageTitle title="Dashboard" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div>
        <PageTitle title="Dashboard" />
        <p className="text-gray-600">No data available.</p>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Dashboard" />

      {/* Dashboard Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <DashboardCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon="👥"
          borderColor="border-blue-500"
        />
        <DashboardCard
          title="Total Owners"
          value={dashboardData.totalOwners}
          icon="🏨"
          borderColor="border-green-500"
        />
        <DashboardCard
          title="Total Customers"
          value={dashboardData.totalCustomers}
          icon="🛎️"
          borderColor="border-purple-500"
        />
        <DashboardCard
          title="Total Hotels"
          value={dashboardData.totalHotels}
          icon="🏢"
          borderColor="border-yellow-500"
        />
      </div>

      {/* Dashboard Cards - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <DashboardCard
          title="Total Rooms"
          value={dashboardData.totalRooms}
          icon="🚪"
          borderColor="border-indigo-500"
        />
        <DashboardCard
          title="Total Bookings"
          value={dashboardData.totalBookings}
          icon="📋"
          borderColor="border-pink-500"
        />
        <DashboardCard
          title="Upcoming Bookings"
          value={dashboardData.upcomingBookings}
          icon="📅"
          borderColor="border-cyan-500"
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue}`}
          icon="💰"
          borderColor="border-orange-500"
        />
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
        </div>

        {dashboardData.recentBookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No bookings found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.customer?.name || "N/A"}</TableCell>
                  <TableCell>{booking.hotel?.name || "N/A"}</TableCell>
                  <TableCell>{booking.room?.name || "N/A"}</TableCell>
                  <TableCell>{getDateFormat(booking.start_date)}</TableCell>
                  <TableCell>{getDateFormat(booking.end_date)}</TableCell>
                  <TableCell>${booking.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status?.charAt(0).toUpperCase() +
                        booking.status?.slice(1).toLowerCase()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;