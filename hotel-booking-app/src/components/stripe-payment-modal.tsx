"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/actions/payments";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
}

function PaymentForm({
  amount,
  onPaymentSuccess,
  onClose,
}: {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An error occurred");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      onPaymentSuccess(paymentIntent.id);
    } else {
      setMessage("Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      <AddressElement
        options={{
          mode: "billing",
          allowedCountries: ["US"],
        }}
      />

      {message && (
        <div className="text-red-600 text-sm text-center">{message}</div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-[#1a5273] hover:bg-[#0d2f38] text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={16} className="mr-2" />
              Pay ${amount}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function StripePaymentModal({
  open,
  onOpenChange,
  amount,
  onPaymentSuccess,
}: StripePaymentModalProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && amount > 0) {
      setLoading(true);
      createPaymentIntent(amount)
        .then((result) => {
          if (result.success && result.clientSecret) {
            setClientSecret(result.clientSecret);
          } else {
            console.error("Failed to create payment intent:", result.message);
          }
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, amount]);

  const handleClose = () => {
    setClientSecret("");
    onOpenChange(false);
  };

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#1a5273",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Complete Payment
          </DialogTitle>
          <div className="text-center text-gray-600">
            Total Amount: <span className="font-bold text-lg">${amount}</span>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading payment form...</span>
          </div>
        ) : clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm
              amount={amount}
              onPaymentSuccess={(paymentId) => {
                onPaymentSuccess(paymentId);
                handleClose();
              }}
              onClose={handleClose}
            />
          </Elements>
        ) : (
          <div className="text-center py-8 text-red-600">
            Failed to load payment form. Please try again.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default StripePaymentModal;
