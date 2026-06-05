"use client";

import React, { useEffect, useState } from "react";
import { getRoomById } from "@/actions/rooms";
import InfoMessage from "@/components/info-message";
import AvailabilityCheck from "@/components/availability-check";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import Link from "next/link";

interface BookRoomDetailPageProps {
  params: Promise<{ id: string }>;
}

function BookRoomDetailPage({ params }: BookRoomDetailPageProps) {
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const { id } = await params;
        const result = await getRoomById(Number(id));
        if (result.success && result.data) {
          setRoom(result.data);
        } else {
          setError(result.message || "Failed to fetch room");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [params]);

  const handleNextImage = () => {
    if (room?.images && room.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const handlePrevImage = () => {
    if (room?.images && room.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + room.images.length) % room.images.length
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading room details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!room) {
    return <InfoMessage message="Room not found" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div>
        <Link
          href="/customer/book-room"
          className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
        >
          ← Back to Rooms
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Title and Price - Left Side */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {room.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin size={16} className="shrink-0" />
              <span className="text-sm">{room.hotel?.name || "Unknown Hotel"}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">
                ${room.rent_per_day}
              </span>
              <span className="text-gray-600">/night</span>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Image Carousel */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {room.images && room.images.length > 0 ? (
                  <div className="relative h-96 bg-gray-200 mt-5">
                    <img
                      src={room.images[currentImageIndex]}
                      alt={`${room.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Image Navigation */}
                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition"
                        >
                          <ChevronRight size={24} />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {room.images.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-96 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}

                {/* Thumbnail Images */}
                {room.images && room.images.length > 1 && (
                  <div className="p-4 bg-white border-t flex gap-2 overflow-x-auto mt-5">
                    {room.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                          currentImageIndex === index
                            ? "border-[#1a5273]"
                            : "border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Description */}
              <div className="bg-white rounded-lg shadow-md p-6 border">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  About this room
                </h2>
                <div
                  className="text-gray-600 leading-relaxed prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: room.description }}
                />
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 border">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Star size={16} className="text-green-600" />
                        </div>
                        <span className="text-gray-700 capitalize text-sm">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Availability Check - Right Side */}
          <div className="lg:col-span-1">
            <AvailabilityCheck
              roomId={room.id}
              roomName={room.name}
              pricePerNight={room.rent_per_day}
              hotelId={room.hotel_id}
              ownerId={room.owner_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookRoomDetailPage;
