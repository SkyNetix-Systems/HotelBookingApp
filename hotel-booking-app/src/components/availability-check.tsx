"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { checkAvailabilityOfRoom, bookRoom } from "@/actions/bookings";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useUsersStore } from "@/store/users-store";
import StripePaymentModal from "@/components/stripe-payment-modal";
import toast from "react-hot-toast";

interface AvailabilityCheckProps {
  roomId: number;
  roomName: string;
  pricePerNight: number;
  hotelId: number;
  ownerId: number;
}

function AvailabilityCheck({
  roomId,
  roomName,
  pricePerNight,
  hotelId,
  ownerId,
}: AvailabilityCheckProps) {
  const router = useRouter();
  const { loggedInUser } = useUsersStore();
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    success: boolean;
    available?: boolean;
    message: string;
  } | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isBookEnabled, setIsBookEnabled] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const generateBookedDates = (start: string, end: string): string[] => {
    const dates: string[] = [];
    let current = dayjs(start);

    while (current.isBefore(end)) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    return dates;
  };

  const calculateNights = (start: string, end: string): number => {
    return dayjs(end).diff(dayjs(start), "day");
  };

  const isDatesValid = (): boolean => {
    return (
      checkInDate !== "" &&
      checkOutDate !== "" &&
      dayjs(checkInDate).isBefore(dayjs(checkOutDate))
    );
  };

  const handleCheckAvailability = async () => {
    if (!isDatesValid()) {
      return;
    }

    setIsChecking(true);
    setAvailabilityResult(null);
    setTotalPrice(null);
    setIsBookEnabled(false);

    try {
      const bookedDates = generateBookedDates(checkInDate, checkOutDate);
      const result = await checkAvailabilityOfRoom(roomId, bookedDates);
      setAvailabilityResult(result);

      if (result.success && result.available) {
        const nights = calculateNights(checkInDate, checkOutDate);
        setTotalPrice(nights * pricePerNight);
        setIsBookEnabled(true);
      } else {
        setIsBookEnabled(false);
      }
    } catch (error) {
      setAvailabilityResult({
        success: false,
        message: "An error occurred while checking availability",
      });
      setIsBookEnabled(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleBookThisRoom = async (paymentId: string) => {
    if (!loggedInUser) return;

    try {
      const bookedDates = generateBookedDates(checkInDate, checkOutDate);
      const result = await bookRoom({
        room_id: roomId,
        hotel_id: hotelId,
        owner_id: ownerId,
        customer_id: loggedInUser.id,
        booked_dates: bookedDates,
        start_date: checkInDate,
        end_date: checkOutDate,
        amount: totalPrice!,
        status: "confirmed",
        payment_id: paymentId,
      });

      if (result.success) {
        toast.success("Room booked successfully!");
        router.push("/customer/bookings");
      } else {
        alert(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while booking the room");
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    handleBookThisRoom(paymentId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Check Availability
      </h2>

      {/* Check-in Date */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Check-in Date
        </label>
        <Input
          type="date"
          value={checkInDate}
          onChange={(e) => {
            setCheckInDate(e.target.value);
            setAvailabilityResult(null);
            setTotalPrice(null);
            setIsBookEnabled(false);
          }}
          className="w-full border-gray-300"
          min={dayjs().format("YYYY-MM-DD")}
        />
      </div>

      {/* Check-out Date */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Check-out Date
        </label>
        <Input
          type="date"
          value={checkOutDate}
          onChange={(e) => {
            setCheckOutDate(e.target.value);
            setAvailabilityResult(null);
            setTotalPrice(null);
            setIsBookEnabled(false);
          }}
          className="w-full border-gray-300"
          min={
            checkInDate
              ? dayjs(checkInDate).add(1, "day").format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD")
          }
        />
      </div>

      {/* Check Availability Button */}
      <Button
        onClick={handleCheckAvailability}
        disabled={isChecking || !isDatesValid()}
        className="w-full"
      >
        <Search size={18} />
        {isChecking ? "Checking..." : "Check Availability"}
      </Button>

      {/* Book This Room Button */}
      <Button
        onClick={() => setPaymentModalOpen(true)}
        disabled={!isBookEnabled}
        className="w-full mt-5"
      >
        Book This Room
      </Button>

      {/* Availability Result */}
      {availabilityResult && (
        <div className="mt-4">
          {availabilityResult.success && availabilityResult.available === true ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-semibold text-green-800">Room Available</span>
              </div>
              <div className="text-green-700">
                <p className="text-sm">Total Price: <span className="font-bold">${totalPrice}</span></p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={20} className="text-red-600" />
                <span className="font-semibold text-red-800">Not Available</span>
              </div>
              <p className="text-red-700 text-sm">{availabilityResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Additional Info */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Complete booking on the next step
      </p>

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        amount={totalPrice || 0}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default AvailabilityCheck;
