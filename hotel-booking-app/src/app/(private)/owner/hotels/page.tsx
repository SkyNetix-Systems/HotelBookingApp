"use client";

import React, { useEffect, useState } from "react";
import { deleteHotel, getHotelsByOwnerId } from "@/actions/hotels";
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
import { IHotel } from "@/interfaces";
import { getDateTimeFormat, getHotelStatusColor } from "@/helpers";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

function HotelOwnersPage() {
  const { loggedInUser }: UsersStore = useUsersStore();
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        if (loggedInUser?.id) {
          const result = await getHotelsByOwnerId(loggedInUser.id);
          if (result.success && result.data) {
            setHotels(result.data);
          } else {
            setError(result.message || "Failed to fetch hotels");
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [loggedInUser?.id]);

  // Handle delete hotel
  const handleDeleteHotel = async (hotelId: number, hotelName: string) => {
    setDeletingId(hotelId);
    try {
      const result = await deleteHotel(hotelId);

      if (result.success) {
        // Remove hotel from local state
        setHotels((prev) => prev.filter((hotel) => hotel.id !== hotelId));
        toast.success(result.message || "Hotel deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete hotel");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting the hotel");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageTitle title="My Hotels" />
        <Button className="bg-[#1a5273] hover:bg-[#0d2f38] text-white">
          <Link href="/owner/hotels/add">+ Add New Hotel</Link>
        </Button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading hotels...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : hotels.length === 0 ? (
          <InfoMessage message="Create your first hotel to get started." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell className="font-medium">{hotel.name}</TableCell>
                  <TableCell>
                    {hotel.address} {hotel.city && `, ${hotel.city}`}
                  </TableCell>
                  <TableCell>{hotel.phone}</TableCell>
                  <TableCell>{hotel.email}</TableCell>
                  <TableCell>{getDateTimeFormat(hotel.created_at)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getHotelStatusColor(
                        hotel.status
                      )}`}
                    >
                      {hotel.status?.toUpperCase()}
                    </span>
                  </TableCell>
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
                      <Link href={`/owner/hotels/edit/${hotel.id}`}>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                        disabled={deletingId === hotel.id}
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

export default HotelOwnersPage;
