"use server";

import Razorpay from "razorpay";
import supabaseConfig from "@/config/supabase-config";
import { IPayment } from "@/interfaces";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const createPaymentIntent = async (
  bookingId: string,
  amount: number,
  currency: string = "INR",
) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    // Create order with Razorpay
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects amount in paise (smallest unit)
      currency,
      receipt: `order_${bookingId}_${Date.now()}`,
      notes: {
        bookingId,
      },
    });

    return {
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      message: "Razorpay order created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const createPaymentRecord = async (
  payload: Omit<IPayment, "id" | "created_at">,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("payments")
      .insert([payload])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Payment recorded successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: string,
  razorpayPaymentId?: string,
  transactionId?: string,
) => {
  try {
    const updateData: any = { status };
    if (razorpayPaymentId) updateData.stripe_payment_id = razorpayPaymentId;
    if (transactionId) updateData.transaction_id = transactionId;

    const { data, error } = await supabaseConfig
      .from("payments")
      .update(updateData)
      .eq("id", paymentId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
      message: "Payment status updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPaymentsByBookingId = async (bookingId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("payments")
      .select("*")
      .eq("booking_id", bookingId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPaymentsByCustomerId = async (customerId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("payments")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const verifyRazorpayPayment = async (
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string,
) => {
  try {
    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return {
        success: false,
        message: "Payment signature verification failed",
      };
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status === "captured") {
      return {
        success: true,
        data: {
          status: "completed",
          transactionId: payment.id,
          orderId: payment.order_id,
        },
        message: "Payment verified successfully",
      };
    } else {
      return {
        success: false,
        message: `Payment status: ${payment.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const refundPayment = async (razorpayPaymentId: string) => {
  try {
    const refund = await razorpay.payments.refund(razorpayPaymentId, {
      speed: "optimum",
    });

    return {
      success: true,
      data: {
        refundId: refund.id,
      },
      message: "Refund processed successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const confirmPayment = async (razorpayPaymentId: string) => {
  try {
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status === "captured") {
      return {
        success: true,
        paymentId: razorpayPaymentId,
      };
    } else {
      return {
        success: false,
        message: "Payment not completed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
