"use server";

import supabaseConfig from "@/config/supabase-config";
import { IRoom } from "@/interfaces";

export const createRoom = async (payload: Omit<IRoom, "id" | "created_at">) => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .insert([
        {
          name: payload.name,
          description: payload.description,
          type: payload.type,
          rent_per_day: payload.rent_per_day,
          hotel_id: payload.hotel_id,
          owner_id: payload.owner_id,
          capacity: payload.capacity,
          status: payload.status,
          amenities: payload.amenities,
          images: payload.images,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Room created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const editRoom = async (
  id: string,
  payload: Partial<Omit<IRoom, "id" | "created_at">>,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Room updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteRoom = async (id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Room deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getRoomById = async (id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getRoomsByOwnerId = async (owner_id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .select("*")
      .eq("owner_id", owner_id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getRoomsByHotelId = async (hotel_id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .select("*")
      .eq("hotel_id", hotel_id)
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllRooms = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getActiveRooms = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .select("*, hotel:hotels(name, id)")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getFilteredActiveRooms = async (
  roomType?: string,
  sortBy?: string,
) => {
  try {
    let query = supabaseConfig
      .from("rooms")
      .select("*, hotel:hotels(name, id)")
      .eq("status", "available");

    if (roomType) {
      query = query.eq("type", roomType);
    }

    // Apply sorting
    if (sortBy === "rent_per_day_asc") {
      query = query.order("rent_per_day", { ascending: true });
    } else if (sortBy === "rent_per_day_desc") {
      query = query.order("rent_per_day", { ascending: false });
    } else if (sortBy === "created_at_asc") {
      query = query.order("created_at", { ascending: true });
    } else {
      // Default: newest first
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
