"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReactSimpleWysiwygEditor from "react-simple-wysiwyg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createRoom, editRoom } from "@/actions/rooms";
import { getHotelsByOwnerId } from "@/actions/hotels";
import { uploadFile } from "@/actions/uploads";
import { UsersStore, useUsersStore } from "@/store/users-store";
import { roomTypes, amenities, roomStatuses } from "@/constants";
import { IHotel } from "@/interfaces";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.string().min(2, {
    message: "Room type is required.",
  }),
  rent_per_day: z.string().min(1, {
    message: "Rent per day is required.",
  }),
  hotel_id: z.string().min(1, {
    message: "Hotel is required.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RoomFormProps {
  formType: "add" | "edit";
  roomData?: any;
}

function RoomForm({ formType, roomData }: RoomFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ file: File; preview: string }>
  >([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    roomData?.images || [],
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    roomData?.amenities || [],
  );
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loggedInUser }: UsersStore = useUsersStore();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: roomData?.name || "",
      description: roomData?.description || "",
      type: roomData?.type || "",
      rent_per_day: roomData?.rent_per_day.toString() || 0,
      hotel_id: roomData?.hotel_id?.toString() || 0,
      status: roomData?.status || "active",
      amenities: roomData?.amenities || [],
    },
  });

  // Fetch hotels on mount
  useEffect(() => {
    const fetchHotels = async () => {
      if (!loggedInUser?.id) return;
      setLoadingHotels(true);
      try {
        const result = await getHotelsByOwnerId(loggedInUser.id);
        if (result.success && result.data) {
          setHotels(result.data);
        }
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, [loggedInUser?.id]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file deletion
  const handleDeleteFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Handle existing image deletion
  const handleDeleteExistingImage = (index: number) => {
    setExistingImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((a) => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      let uploadedImagesUrls: string[] = [...existingImages];

      for (const item of selectedFiles) {
        const uploadResult = await uploadFile(item.file);
        if (uploadResult.success && uploadResult.url) {
          uploadedImagesUrls.push(uploadResult.url);
        }
      }

      const rentPerDay = parseFloat(values.rent_per_day);

      let response;
      if (formType === "add") {
        response = await createRoom({
          ...values,
          rent_per_day: rentPerDay,
          images: uploadedImagesUrls,
          amenities: selectedAmenities,
          owner_id: loggedInUser?.id,
        });
      } else {
        response = await editRoom(roomData.id, {
          ...values,
          rent_per_day: rentPerDay,
          images: uploadedImagesUrls,
          amenities: selectedAmenities,
        });
      }

      if (response?.success) {
        toast.success(response.message || "Room added successfully!");
        router.push("/owner/rooms");
      } else {
        toast.error(response?.message || "Failed to add room.");
      }
    } catch (err: any) {
      console.error("Error:", err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Room Name and Type - Grid Layout */}
          <div className="grid grid-cols-3 gap-4">
            {/* Room Name Field */}
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      Room Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter room name"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Room Type Field */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="select">
                  <FormLabel className="text-gray-700 font-semibold">
                    Room Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">
                  Description
                </FormLabel>
                <FormControl>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <ReactSimpleWysiwygEditor
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full min-h-[200px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rent per Day, Hotel, Status - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rent per Day Field */}
            <FormField
              control={form.control}
              name="rent_per_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Rent per Day ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="border-gray-300"
                      {...field}
                      value={parseFloat(field.value)}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hotel Field */}
            <FormField
              control={form.control}
              name="hotel_id"
              render={({ field }) => (
                <FormItem className="select">
                  <FormLabel className="text-gray-700 font-semibold">
                    Hotel
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString() || ""}
                      disabled={loadingHotels}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select a hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem
                            key={hotel.id}
                            value={hotel.id.toString()}
                          >
                            {hotel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="select">
                  <FormLabel className="text-gray-700 font-semibold">
                    Status
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Amenities Field */}
          <div>
            <FormLabel className="text-gray-700 font-semibold block mb-3">
              Amenities
            </FormLabel>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <button
                  key={amenity.value}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity.value)}
                  className={`px-4 text-sm py-2 rounded-lg font-medium transition ${
                    selectedAmenities.includes(amenity.value)
                      ? "bg-[#1a5273] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Images Field */}
          <div>
            <FormLabel className="text-gray-700 font-semibold block mb-2">
              Images
            </FormLabel>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-gray-600 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-500 text-sm mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>

            {/* Existing Images Section */}
            {existingImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-gray-700 font-semibold mb-4">
                  Existing Images ({existingImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((imageUrl, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                    >
                      <img
                        src={imageUrl}
                        alt={`Existing ${index}`}
                        className="w-full h-32 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>

                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-600 truncate">
                          Existing Image
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-gray-700 font-semibold mb-4">
                  New Images ({selectedFiles.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedFiles.map((item, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                    >
                      <img
                        src={item.preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleDeleteFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>

                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-600 truncate">
                          {item.file.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : formType === "add"
                  ? "Add Room"
                  : "Update Room"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default RoomForm;
