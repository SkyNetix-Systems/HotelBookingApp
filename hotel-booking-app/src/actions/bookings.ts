"use server";

import supabaseConfig from "@/config/supabase-config";
import { IBooking } from "@/interfaces";

export const checkAvailabilityOfRoom = async (
  roomId: number,
  bookedDates: string[]
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .select("*")
      .eq("room_id", roomId)
      .neq("status", "cancelled")
      .overlaps("booked_dates", bookedDates);

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      return {
        success: false,
        available: false,
        message: "Room is not available for the selected dates",
      };
    }

    return {
      success: true,
      available: true,
      message: "Room is available for the selected dates",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const bookRoom = async (bookingData: {
  room_id: number;
  hotel_id: number;
  owner_id: number;
  customer_id: number;
  booked_dates: string[];
  start_date: string;
  end_date: string;
  amount: number;
  status: string;
  payment_id: string;
}) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .insert([bookingData]);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data,
      message: "Room booked successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const getBookingsByCustomerId = async (customerId: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .select(`
        *,
        room:rooms(*),
        hotel:hotels(*),
        owner:user_profiles!bookings_owner_id_fkey(*),
        customer:user_profiles!bookings_customer_id_fkey(*)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const updateBookingStatus = async (id: number, status: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Booking status updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const getBookingsByOwnerId = async (ownerId: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .select(`
        *,
        room:rooms(*),
        hotel:hotels(*),
        owner:user_profiles!bookings_owner_id_fkey(*),
        customer:user_profiles!bookings_customer_id_fkey(*)
      `)
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
