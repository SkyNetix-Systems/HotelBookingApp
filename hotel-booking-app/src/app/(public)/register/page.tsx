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
import { registerUser } from "@/actions/users";
import toast from "react-hot-toast";


// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
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

function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);

    try {
      const result = await registerUser(values);

      if (result.success) {
        // Show success toast
        toast.success("Registration successful! Redirecting to login...");
        // Navigate to login page on success
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        // Show error toast
        toast.error(result.message || "Registration failed");
      }
    } catch (err: any) {
      // Show error toast
      toast.error(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  }

  const handleNavigateHome = () => {
    router.push("/");
  };

  const handleNavigateLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4">
      <div className="w-[450px] bg-white rounded-lg shadow-md p-8">
        {/* Header with Home link */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-primary">
            Register your account
          </h1>
          <button
            onClick={handleNavigateHome}
            className="text-xs text-primary hover:text-[#0d2f38] font-semibold flex items-center gap-1"
          >
            ← Home
          </button>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-300 mb-6"></div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
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
                      {/* <SelectItem value="admin">Administrator</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Register Button */}
            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={handleNavigateLogin}
            className="text-primary hover:text-[#0d2f38] font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
