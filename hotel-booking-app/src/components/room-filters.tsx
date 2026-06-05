"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roomTypes, roomsSortOptions } from "@/constants";
import { RotateCcw, Filter } from "lucide-react";

interface RoomFiltersProps {
  onApplyFilters: (roomType?: string, sortBy?: string) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

function RoomFilters({
  onApplyFilters,
  onClearFilters,
  isLoading = false,
}: RoomFiltersProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("");

  const handleApplyFilters = () => {
    onApplyFilters(selectedRoomType || undefined, selectedSort || undefined);
  };

  const handleClearFilters = () => {
    setSelectedRoomType("");
    setSelectedSort("");
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  

      <div className="grid grid-cols-4 gap-4">
        {/* Room Type Filter */}
        <div className="select">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Room Type
          </label>
          <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="All Room Types" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Filter */}
        <div className="select">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sort By
          </label>
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              {roomsSortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Apply Filters Button */}
        <div className="flex items-end">
          <Button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="w-full bg-[#1a5273] hover:bg-[#0d2f38] text-white font-semibold"
          >
            <Filter size={18} className="mr-2" />
            Apply Filters
          </Button>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <Button
            onClick={handleClearFilters}
            disabled={isLoading}
            variant="outline"
            className="w-full font-semibold border-gray-300"
          >
            <RotateCcw size={18} className="mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RoomFilters;
