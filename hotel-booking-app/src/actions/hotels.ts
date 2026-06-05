"use server";

import supabaseConfig from "@/config/supabase-config";
import { IHotel } from "@/interfaces";

export const createHotel = async (
  payload: Omit<IHotel, "id" | "created_at">,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .insert([
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
      ])
      .select();

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
  id: string,
  payload: Partial<Omit<IHotel, "id" | "created_at">>,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .update(payload)
      .eq("id", id)
      .select();

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

export const deleteHotel = async (id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .delete()
      .eq("id", id)
      .select();

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

export const getHotelById = async (id: string) => {
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

export const getHotelsByOwnerId = async (owner_id: string) => {
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
      .select("*")
      .eq("status", "active")
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

export const getHotelsByCity = async (city: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .select("*")
      .eq("city", city)
      .eq("status", "active")
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
