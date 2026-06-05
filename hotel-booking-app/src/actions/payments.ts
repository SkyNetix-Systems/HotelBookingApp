"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createPaymentIntent = async (amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      description: "Hotel Room Booking Payment",
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const confirmPayment = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      return {
        success: true,
        paymentId: paymentIntentId,
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