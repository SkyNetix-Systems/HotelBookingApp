"use server";

import supabaseConfig from "@/config/supabase-config";
import { IHotel } from "@/interfaces";

export const createHotel = async (
  payload: Omit<IHotel, "id" | "created_at">
) => {
  try {
    const { data, error } = await supabaseConfig.from("hotels").insert([
      {
        name: payload.name,
        description: payload.description,
        city: payload.city,
        address: payload.address,
        email: payload.email,
        phone: payload.phone,
        images: payload.images,
        status: payload.status,
        owner_id: payload.owner_id,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Hotel created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const editHotel = async (
  id: number,
  payload: Partial<Omit<IHotel, "id" | "created_at">>
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .update(payload)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Hotel updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteHotel = async (id: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Hotel deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getHotelById = async (id: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
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

export const getHotelsByOwnerId = async (owner_id: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
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

export const getAllHotels = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .select("*, owner:user_profiles(name, email)")
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
