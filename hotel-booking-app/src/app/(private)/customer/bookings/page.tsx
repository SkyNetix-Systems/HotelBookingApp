"use client";

import React, { useEffect, useState } from "react";
import { getBookingsByCustomerId, updateBookingStatus } from "@/actions/bookings";
import PageTitle from "@/components/page-title";
import InfoMessage from "@/components/info-message";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UsersStore, useUsersStore } from "@/store/users-store";
import { IBooking } from "@/interfaces";
import { getDateTimeFormat } from "@/helpers";
import { Eye, Calendar, MapPin, DollarSign, User } from "lucide-react";
import toast from "react-hot-toast";
import BookingInfoModal from "@/components/booking-info-modal";

function CustomerBookingsPage() {
  const { loggedInUser }: UsersStore = useUsersStore();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewBooking = (booking: IBooking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        if (loggedInUser?.id) {
          const result = await getBookingsByCustomerId(loggedInUser.id);
          if (result.success && result.data) {
            setBookings(result.data);
          } else {
            setError(result.message || "Failed to fetch bookings");
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [loggedInUser?.id]);

  // Handle status change
  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const result = await updateBookingStatus(bookingId, newStatus);

      if (result.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
        toast.success(result.message || "Booking status updated successfully");
      } else {
        toast.error(result.message || "Failed to update booking status");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while updating the booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageTitle title="My Bookings" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading bookings...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : bookings.length === 0 ? (
          <InfoMessage message="You haven't made any bookings yet." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booked On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      {booking.hotel?.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>{booking.room?.name || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      {booking.start_date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      {booking.end_date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-500" />
                      ${booking.amount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(value) => handleStatusChange(booking.id, value)}
                      disabled={updatingId === booking.id}
                    >
                      <SelectTrigger className={`w-32 ${getStatusColor(booking.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{getDateTimeFormat(booking.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Booking Info Modal */}
      <BookingInfoModal
        booking={selectedBooking}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

export default CustomerBookingsPage;