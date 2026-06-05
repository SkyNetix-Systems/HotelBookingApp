"use server";

import supabaseConfig from "@/config/supabase-config";
import { IBooking } from "@/interfaces";

export const checkAvailabilityOfRoom = async (
  roomId: string,
  checkInDate: string,
  checkOutDate: string,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .select("*")
      .eq("room_id", roomId)
      .neq("status", "cancelled")
      .lte("check_in_date", checkOutDate)
      .gte("check_out_date", checkInDate);

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

export const bookRoom = async (
  payload: Omit<IBooking, "id" | "created_at">,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .insert([payload])
      .select();

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

export const getBookingsByCustomerId = async (customerId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .select("*")
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

export const updateBookingStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select();

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

export const getBookingsByOwnerId = async (ownerId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .select("*")
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

export const cancelBooking = async (id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Booking cancelled successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
