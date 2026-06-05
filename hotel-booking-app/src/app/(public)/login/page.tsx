"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginUser } from "@/actions/users";
import toast from "react-hot-toast";

// Define the form schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);

    try {
      const result = await loginUser(values);

      if (result.success) {
        // Show success toast
        toast.success("Login successful! Redirecting...");
        router.push(`${values.role}/dashboard`);
      } else {
        // Show error toast
        toast.error(result.message || "Login failed");
      }
    } catch (err: any) {
      // Show error toast
      toast.error(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  }

  const handleNavigateHome = () => {
    router.push("/");
  };

  const handleNavigateRegister = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4">
      <div className="w-[450px] bg-white rounded-lg shadow-md p-8">
        {/* Header with Home link */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-primary">
            Login to your account
          </h1>
          <button
            onClick={handleNavigateHome}
            className="text-xs text-primary hover:text-primary font-semibold flex items-center gap-1"
          >
            ← Home
          </button>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-300 mb-6"></div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="select">
                  <FormLabel className="text-gray-700">Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="owner">Hotel Owner</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#0d2f38] text-white font-semibold py-2 rounded-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={handleNavigateRegister}
            className="text-primary hover:text-primary font-semibold"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
