"use client";

import React, { useEffect, useState } from "react";
import { editHotel, getAllHotels } from "@/actions/hotels";
import PageTitle from "@/components/page-title";
import InfoMessage from "@/components/info-message";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IHotel } from "@/interfaces";
import { getDateTimeFormat } from "@/helpers";
import { Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HotelInfoModal from "@/components/hotel-info-modal";

function AdminHotelsPage() {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<IHotel | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const result = await getAllHotels();
        if (result.success && result.data) {
          setHotels(result.data);
        } else {
          setError(result.message || "Failed to fetch hotels");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Handle status change
  const handleStatusChange = async (newStatus: string, hotelId: number) => {
    setUpdatingId(hotelId);
    try {
      const result = await editHotel(hotelId, { status: newStatus });

      if (result.success) {
        // Update local state
        setHotels((prev) =>
          prev.map((hotel) =>
            hotel.id === hotelId ? { ...hotel, status: newStatus } : hotel
          )
        );
        toast.success("Hotel status updated successfully");
      } else {
        toast.error(result.message || "Failed to update hotel status");
      }
    } catch (err: any) {
      toast.error(
        err.message || "An error occurred while updating the hotel status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageTitle title="All Hotels" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading hotels...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : hotels.length === 0 ? (
          <InfoMessage message="No hotels found." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel Name</TableHead>
                <TableHead>Owner</TableHead>
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
                  <TableCell>{hotel.owner?.name || "N/A"}</TableCell>
                  <TableCell>
                    {hotel.address} {hotel.city && `, ${hotel.city}`}
                  </TableCell>
                  <TableCell>{hotel.phone}</TableCell>
                  <TableCell>{hotel.email}</TableCell>
                  <TableCell>{getDateTimeFormat(hotel.created_at)}</TableCell>
                  <TableCell>
                    <Select
                      value={hotel.status}
                      onValueChange={(value) =>
                        handleStatusChange(value, hotel.id)
                      }
                      disabled={updatingId === hotel.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Hotel Info Modal */}
      <HotelInfoModal
        hotel={selectedHotel}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

export default AdminHotelsPage;
