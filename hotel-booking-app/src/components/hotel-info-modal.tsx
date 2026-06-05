"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IHotel } from "@/interfaces";
import { getDateTimeFormat, getHotelStatusColor } from "@/helpers";
import {
  FileText,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Calendar,
  User,
  Image as ImageIcon,
  Building,
} from "lucide-react";

interface HotelInfoModalProps {
  hotel: IHotel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

function InfoField({ icon, label, value, className = "" }: InfoFieldProps) {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  );
}

function HotelInfoModal({ hotel, open, onOpenChange }: HotelInfoModalProps) {
  if (!hotel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building size={24} />
            {hotel.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hotel Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoField
              icon={<CheckCircle size={16} className="text-blue-600" />}
              label="Status"
              value={
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getHotelStatusColor(
                    hotel.status
                  )}`}
                >
                  {hotel.status?.toUpperCase()}
                </span>
              }
            />
            <InfoField
              icon={<Calendar size={16} className="text-blue-600" />}
              label="Created On"
              value={getDateTimeFormat(hotel.created_at)}
            />
            <InfoField
              icon={<User size={16} className="text-blue-600" />}
              label="Owner"
              value={hotel.owner?.name || "N/A"}
            />
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Phone size={18} />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                icon={<Mail size={16} className="text-green-600" />}
                label="Email"
                value={hotel.email}
              />
              <InfoField
                icon={<Phone size={16} className="text-green-600" />}
                label="Phone"
                value={hotel.phone}
              />
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin size={18} />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                icon={<MapPin size={16} className="text-red-600" />}
                label="Address"
                value={hotel.address}
              />
              <InfoField
                icon={<MapPin size={16} className="text-red-600" />}
                label="City"
                value={hotel.city || "N/A"}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={18} />
              Description
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p
                className="text-sm text-gray-900 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: hotel.description || "No description available" }}
              />
            </div>
          </div>

          {/* Images */}
          {hotel.images && hotel.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon size={18} />
                Hotel Images ({hotel.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hotel.images.map((image, index) => (
                  <div key={index} className="aspect-square">
                    <img
                      src={image}
                      alt={`Hotel image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HotelInfoModal;
