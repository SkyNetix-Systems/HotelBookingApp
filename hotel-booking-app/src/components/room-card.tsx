"use client";

import React from "react";
import Link from "next/link";
import { IRoom } from "@/interfaces";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface RoomCardProps {
  room: any;
}

function RoomCard({ room }: RoomCardProps) {
  // Truncate description to 100 characters
  const truncatedDescription = 
    room.description && room.description.length > 100
      ? room.description.substring(0, 100) + "..."
      : room.description;

  // Get first 3 amenities and count remaining
  const displayedAmenities = room.amenities?.slice(0, 3) || [];
  const remainingAmenities = 
    (room.amenities?.length || 0) - displayedAmenities.length;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
      {/* Room Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="p-5">
        {/* Room Name and Status */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 flex-1">
            {room.name}
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            AVAILABLE
          </span>
        </div>

        {/* Hotel Name */}
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <MapPin size={16} className="shrink-0" />
          <span className="text-sm">{room.hotel?.name || "Unknown Hotel"}</span>
        </div>

        {/* Room Type */}
        <p className="text-sm text-gray-600 mb-2 capitalize">
          Type: <span className="font-medium">{room.type}</span>
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {truncatedDescription}
        </p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-green-600">
            $ {room.rent_per_day}
          </span>
          <span className="text-gray-600 text-sm">/day</span>
        </div>

        {/* Amenities */}
        {displayedAmenities.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Amenities:
            </p>
            <div className="flex flex-wrap gap-2">
              {displayedAmenities.map((amenity: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {remainingAmenities > 0 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  +{remainingAmenities} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <Link href={`/customer/book-room/${room.id}`}>
          <Button className="w-full">
            <Calendar size={18} />
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default RoomCard;
