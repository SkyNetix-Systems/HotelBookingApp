"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPaymentIntent, verifyRazorpayPayment } from "@/actions/payments";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface RazorpayPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onPaymentSuccess: (paymentId: string) => void;
}

export function RazorpayPaymentModal({
  open,
  onOpenChange,
  bookingId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
}: RazorpayPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await createPaymentIntent(bookingId, amount);

      if (!orderResponse.success) {
        toast.error(orderResponse.message);
        setIsProcessing(false);
        return;
      }

      const { orderId } = orderResponse.data;

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: Math.round(amount * 100),
          currency: "INR",
          name: "Hotel Booking App",
          description: `Booking ID: ${bookingId}`,
          image: "/skynetix.png",
          order_id: orderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          handler: async (response: any) => {
            // Verify payment signature
            const verifyResponse = await verifyRazorpayPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
            );

            if (verifyResponse.success) {
              toast.success("Payment successful!");
              onPaymentSuccess(response.razorpay_payment_id);
              onOpenChange(false);
            } else {
              toast.error(verifyResponse.message);
            }
            setIsProcessing(false);
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Amount to Pay</p>
            <p className="text-2xl font-bold text-blue-600">₹{amount}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Booking ID:</span> {bookingId}
            </p>
            <p>
              <span className="font-semibold">Name:</span> {customerName}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {customerEmail}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800">
            You will be redirected to Razorpay's secure payment gateway.
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
