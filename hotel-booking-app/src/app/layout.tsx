import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CustomLayout from "@/custom-layout";

export const metadata: Metadata = {
  title: "Next Hotel Rooms Booking",
  description:
    "A simple hotel rooms booking application built with Next.js & Github Copilot",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased ${montserrat.className}`}
        suppressHydrationWarning
      >
        <Toaster position="top-right" />

        <CustomLayout>{children}</CustomLayout>
      </body>
    </html>
  );
}
