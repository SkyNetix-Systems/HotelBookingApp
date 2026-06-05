"use client";

import React, { useEffect, useState } from "react";
import { deleteRoom, getRoomsByOwnerId } from "@/actions/rooms";
import PageTitle from "@/components/page-title";
import InfoMessage from "@/components/info-message";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersStore, useUsersStore } from "@/store/users-store";
import { IRoom } from "@/interfaces";
import { getDateTimeFormat } from "@/helpers";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

function RoomsPage() {
  const { loggedInUser }: UsersStore = useUsersStore();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        if (loggedInUser?.id) {
          const result = await getRoomsByOwnerId(loggedInUser.id);
          if (result.success && result.data) {
            setRooms(result.data);
          } else {
            setError(result.message || "Failed to fetch rooms");
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [loggedInUser?.id]);

  // Handle delete room
  const handleDeleteRoom = async (roomId: number, roomName: string) => {
    setDeletingId(roomId);
    try {
      const result = await deleteRoom(roomId);

      if (result.success) {
        setRooms((prev) => prev.filter((room) => room.id !== roomId));
        toast.success(result.message || "Room deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete room");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting the room");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageTitle title="My Rooms" />
        <Button className="bg-[#1a5273] hover:bg-[#0d2f38] text-white">
          <Link href="/owner/rooms/add">+ Add New Room</Link>
        </Button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading rooms...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : rooms.length === 0 ? (
          <InfoMessage message="Create your first room to get started." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Hotel Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rent per Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.hotel?.name || "N/A"}</TableCell>
                  <TableCell className="capitalize">{room.type}</TableCell>
                  <TableCell>${room.rent_per_day}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        room.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {room.status?.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{getDateTimeFormat(room.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Button */}
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit Button */}
                      <Link href={`/owner/rooms/edit/${room.id}`}>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteRoom(room.id, room.name)}
                        disabled={deletingId === room.id}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default RoomsPage;
