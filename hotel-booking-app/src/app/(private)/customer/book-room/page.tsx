"use client";

import PageTitle from "@/components/page-title";
import RoomCard from "@/components/room-card";
import RoomFilters from "@/components/room-filters";
import React, { useEffect, useState } from "react";
import { getActiveRooms, getFilteredActiveRooms } from "@/actions/rooms";
import InfoMessage from "@/components/info-message";

function BookRoomPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getActiveRooms();
      if (result.success && result.data) {
        setRooms(result.data);
      } else {
        setError(result.message || "Failed to fetch rooms");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (
    roomType?: string,
    sortBy?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getFilteredActiveRooms(roomType, sortBy);
      if (result.success && result.data) {
        setRooms(result.data);
      } else {
        setError(result.message || "Failed to fetch filtered rooms");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    await fetchRooms();
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle title="Book a Room" />

      {/* Filters */}
      <RoomFilters
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        isLoading={loading}
      />

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading rooms...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      ) : rooms.length === 0 ? (
        <InfoMessage message="No available rooms matching your filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookRoomPage;
