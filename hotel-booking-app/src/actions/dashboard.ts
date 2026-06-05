"use server";

import supabaseConfig from "@/config/supabase-config";

export const getOwnerDashboardData = async (ownerId: string) => {
  try {
    // Fetch all data using Promise.all
    const [bookingsResponse, hotelsCountResponse, roomsCountResponse] =
      await Promise.all([
        supabaseConfig
          .from("bookings")
          .select("*")
          .eq("owner_id", ownerId)
          .order("created_at", { ascending: false }),
        supabaseConfig
          .from("hotels")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", ownerId),
        supabaseConfig
          .from("rooms")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", ownerId),
      ]);

    if (bookingsResponse.error) {
      throw new Error(bookingsResponse.error.message);
    }

    if (hotelsCountResponse.error) {
      throw new Error(hotelsCountResponse.error.message);
    }

    if (roomsCountResponse.error) {
      throw new Error(roomsCountResponse.error.message);
    }

    const bookings = bookingsResponse.data || [];
    const totalHotels = hotelsCountResponse.count || 0;
    const totalRooms = roomsCountResponse.count || 0;
    const totalBookings = bookings.length;

    // Calculate revenue from confirmed bookings
    const totalRevenue = bookings
      .filter((booking) => booking.status === "confirmed")
      .reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

    // Get last 5 bookings
    const recentBookings = bookings.slice(0, 5);

    return {
      success: true,
      data: {
        totalHotels,
        totalRooms,
        totalBookings,
        totalRevenue,
        recentBookings,
      },
      message: "Dashboard data fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const getCustomerDashboardData = async (customerId: string) => {
  try {
    // Fetch all bookings for the customer using Promise.all
    const [bookingsResponse] = await Promise.all([
      supabaseConfig
        .from("bookings")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false }),
    ]);

    if (bookingsResponse.error) {
      throw new Error(bookingsResponse.error.message);
    }

    const bookings = bookingsResponse.data || [];

    // Calculate dashboard metrics
    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled",
    ).length;
    const completedBookings = bookings.filter(
      (booking) => booking.status === "confirmed",
    ).length;

    // Calculate upcoming bookings (based on start_date > today)
    const today = new Date().toISOString().split("T")[0];
    const upcomingBookings = bookings.filter(
      (booking) => booking.status !== "cancelled" && booking.start_date > today,
    ).length;

    // Get last 5 bookings
    const recentBookings = bookings.slice(0, 5);

    return {
      success: true,
      data: {
        totalBookings,
        cancelledBookings,
        completedBookings,
        upcomingBookings,
        recentBookings,
      },
      message: "Dashboard data fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const getAdminDashboardData = async () => {
  try {
    // Fetch all data using Promise.all
    const [
      usersResponse,
      hotelsCountResponse,
      roomsCountResponse,
      bookingsResponse,
    ] = await Promise.all([
      supabaseConfig.from("user_profiles").select("role"),
      supabaseConfig
        .from("hotels")
        .select("id", { count: "exact", head: true }),
      supabaseConfig.from("rooms").select("id", { count: "exact", head: true }),
      supabaseConfig
        .from("bookings")
        .select(
          `
          *,
          room:rooms(id,name),
          hotel:hotels(id,name),
          customer:user_profiles!bookings_customer_id_fkey(id,name)
        `,
        )
        .order("created_at", { ascending: false }),
    ]);

    if (usersResponse.error) {
      throw new Error(usersResponse.error.message);
    }

    if (hotelsCountResponse.error) {
      throw new Error(hotelsCountResponse.error.message);
    }

    if (roomsCountResponse.error) {
      throw new Error(roomsCountResponse.error.message);
    }

    if (bookingsResponse.error) {
      throw new Error(bookingsResponse.error.message);
    }

    const users = usersResponse.data || [];
    const bookings = bookingsResponse.data || [];
    const totalHotels = hotelsCountResponse.count || 0;
    const totalRooms = roomsCountResponse.count || 0;

    // Calculate dashboard metrics
    const totalUsers = users.length;
    const totalOwners = users.filter((user) => user.role === "owner").length;
    const totalCustomers = users.filter(
      (user) => user.role === "customer",
    ).length;
    const totalBookings = bookings.length;

    // Calculate upcoming bookings (based on start_date > today)
    const today = new Date().toISOString().split("T")[0];
    const upcomingBookings = bookings.filter(
      (booking) => booking.status !== "cancelled" && booking.start_date > today,
    ).length;

    // Calculate total revenue from confirmed bookings
    const totalRevenue = bookings
      .filter((booking) => booking.status === "confirmed")
      .reduce((sum, booking) => sum + (booking.amount || 0), 0);

    // Get last 5 bookings
    const recentBookings = bookings.slice(0, 5);

    return {
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalCustomers,
        totalHotels,
        totalRooms,
        totalBookings,
        upcomingBookings,
        totalRevenue,
        recentBookings,
      },
      message: "Dashboard data fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
