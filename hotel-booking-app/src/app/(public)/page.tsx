"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Homepage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NextHotels</h1>

          <Button
            onClick={() => router.push("/login")}
            className="bg-white text-primary hover:bg-gray-100 font-semibold"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 md:px-12 lg:px-32 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-primary leading-tight mb-4">
                Find Your Perfect Stay Today
              </h2>

              <p className="text-gray-700 text-base leading-7">
                Welcome to HotelBook — your ultimate platform for booking hotel
                rooms. Discover amazing accommodations, compare prices, and book
                your perfect stay with ease. Whether you're traveling for
                business or leisure, we have the right room for you.
              </p>
            </div>

            <Button
              onClick={() => router.push("/register")}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3"
            >
              Start Booking
            </Button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://next-hotels-ai-2025.vercel.app/hero.png"
              alt="Hotel Building"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
