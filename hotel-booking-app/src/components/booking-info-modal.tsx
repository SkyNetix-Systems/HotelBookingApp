"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IBooking } from "@/interfaces";
import {
  Calendar,
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  Building,
  Bed,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { getDateTimeFormat } from "@/helpers";

interface BookingInfoModalProps {
  booking: IBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function BookingInfoModal({ booking, open, onOpenChange }: BookingInfoModalProps) {
  if (!booking) return null;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle size={20} className="text-green-600" />;
      case "cancelled":
        return <XCircle size={20} className="text-red-600" />;
      case "pending":
        return <Clock size={20} className="text-yellow-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" min-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(booking.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                {booking.status?.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Booking ID: #{booking.id}
            </div>
          </div>

          {/* Booking Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={20} />
                Booking Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium text-sm">{booking.start_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium text-sm">{booking.end_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign size={16} className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg text-green-600">${booking.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Booked On</p>
                    <p className="font-medium text-sm">{getDateTimeFormat(booking.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User size={20} />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-sm">{booking.customer?.name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-sm">{booking.customer?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-sm">{booking.hotel?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Bed size={20} />
              Room Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building size={16} className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-600">Hotel</p>
                    <p className="font-medium text-sm">{booking.hotel?.name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Hotel Address</p>
                    <p className="font-medium text-sm">
                      {booking.hotel?.address || "N/A"}
                      {booking.hotel?.city && `, ${booking.hotel.city}`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Bed size={16} className="text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-600">Room</p>
                    <p className="font-medium text-sm">{booking.room?.name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bed size={16} className="text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-600">Room Type</p>
                    <p className="font-medium text-sm">{booking.room?.type || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign size={16} className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Price per Night</p>
                    <p className="font-medium text-sm">${booking.room?.rent_per_day || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booked Dates */}
          {booking.booked_dates && booking.booked_dates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Booked Dates</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {booking.booked_dates.map((date: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {date}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BookingInfoModal;