import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "next-hotels-ai-2025.vercel.app",
      },
    ],
  },
};

export default nextConfig;
