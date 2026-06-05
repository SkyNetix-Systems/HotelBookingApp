"use server";
import supabaseConfig from "@/config/supabase-config";
import { IUser } from "@/interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const registerUser = async (payload: Partial<IUser>) => {
  try {
    // Check if email already exists
    const { data: existingUser, error: fetchError } = await supabaseConfig
      .from("user_profiles")
      .select("email")
      .eq("email", payload.email)
      .single();

    if (existingUser) {
      throw new Error(
        "Email already registered. Please use a different email or login.",
      );
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(payload.password || "", salt);

    const { data, error } = await supabaseConfig.from("user_profiles").insert([
      {
        name: payload.name || null,
        email: payload.email || null,
        password: hashedPassword || null,
        role: payload.role || "customer",
        status: payload.status || "active",
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "User registred successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const loginUser = async (payload: {
  email: string;
  password: string;
  role: string;
}) => {
  try {
    // Get user by email and role
    const { data: user, error: fetchError } = await supabaseConfig
      .from("user_profiles")
      .select("*")
      .eq("email", payload.email)
      .eq("role", payload.role)
      .single();

    if (!user || fetchError) {
      throw new Error("Invalid email or role. User not found.");
    }

    // Compare password
    const isPasswordValid = bcrypt.compareSync(payload.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password. Please try again.");
    }

    // Generate JWT token with user ID and email
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "7d" },
    );

    // Set token in cookies
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      success: true,
      token: token,
      message: "Login successful",
      role: user.role,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCurrentUser = async () => {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Verify and decode JWT token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: number;
      email: string;
      role: string;
    };

    // Fetch user data from database
    const { data: user, error: fetchError } = await supabaseConfig
      .from("user_profiles")
      .select("*")
      .eq("id", decoded.userId)
      .single();

    if (!user || fetchError) {
      throw new Error("User not found");
    }

    // Remove password from user data
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      data: userWithoutPassword,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const logoutUser = async () => {
  try {
    // Clear token from cookies
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("user_profiles")
      .select("*")
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

export const updateUserRole = async (id: number, role: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("user_profiles")
      .update({ role })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "User role updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateUserProfile = async (
  userId: string,
  payload: Partial<Omit<IUser, "id" | "created_at" | "password">>,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("user_profiles")
      .update(payload)
      .eq("id", userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Profile updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  try {
    // Get user
    const { data: user, error: fetchError } = await supabaseConfig
      .from("user_profiles")
      .select("password")
      .eq("id", userId)
      .single();

    if (!user || fetchError) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update password
    const { data, error } = await supabaseConfig
      .from("user_profiles")
      .update({ password: hashedPassword })
      .eq("id", userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
