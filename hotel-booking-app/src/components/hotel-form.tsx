"use client";

import React, { useState, useRef } from "react";
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
import { cities } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createHotel, editHotel } from "@/actions/hotels";
import { uploadFile } from "@/actions/uploads";
import { UsersStore, useUsersStore } from "@/store/users-store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Hotel name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  images: z.array(z.instanceof(File)).optional(),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface HotelFormProps {
  formType: "add" | "edit";
  hotelData?: any;
}

function HotelForm({ formType, hotelData }: HotelFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ file: File; preview: string }>
  >([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    hotelData?.images || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loggedInUser }: UsersStore = useUsersStore();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: hotelData?.name || "",
      description: hotelData?.description || "",
      address: hotelData?.address || "",
      city: hotelData?.city || "",
      phone: hotelData?.phone || "",
      email: hotelData?.email || "",
    },
  });

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
    // Reset input
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

      let response;
      if (formType === "add") {
        response = await createHotel({
          ...values,
          images: uploadedImagesUrls,
          status: "pending",
          owner_id: loggedInUser?.id || 0,
        });
      } else {
        response = await editHotel(hotelData.id, {
          ...values,
          images: uploadedImagesUrls,
        });
      }

      if (response?.success) {
        toast.success(response.message || "Hotel added successfully!");
        router.push("/owner/hotels");
      } else {
        toast.error(response?.message || "Failed to add hotel.");
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
          {/* Hotel Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">
                  Hotel Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter hotel name"
                    {...field}
                    className="border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      {/* Image Preview */}
                      <img
                        src={imageUrl}
                        alt={`Existing ${index}`}
                        className="w-full h-32 object-cover"
                      />

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>

                      {/* Badge */}
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
                      {/* Image Preview */}
                      <img
                        src={item.preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover"
                      />

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>

                      {/* File Name */}
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

          {/* Address, City, Phone, Email - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter hotel address"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City Field */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="select">
                  <FormLabel className="text-gray-700 font-semibold">
                    City
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : formType === "add"
                ? "Add Hotel"
                : "Update Hotel"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default HotelForm;
