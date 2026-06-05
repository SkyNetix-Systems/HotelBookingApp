export interface IUser {
  id: string; // UUID
  created_at: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "owner" | "admin" | string;
  status: string;
}

export interface IHotel {
  id: string; // UUID
  created_at: string;
  name: string;
  description: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  images: string[];
  status: "active" | "inactive" | "deleted" | string;
  owner_id: string; // UUID
  rating?: number;
  total_reviews?: number;
  // Relations (run-time only)
  owner?: IUser;
}

export interface IRoom {
  id: string; // UUID
  created_at: string;
  hotel_id: string; // UUID
  owner_id: string; // UUID
  name: string;
  description: string;
  type: string;
  rent_per_day: number;
  capacity?: number;
  status: "available" | "booked" | "maintenance" | "deleted" | string;
  amenities: string[];
  images: string[];
  // Relations (run-time only)
  hotel?: IHotel;
  owner?: IUser;
}

export interface IBooking {
  id: string; // UUID
  created_at: string;
  room_id: string; // UUID
  hotel_id: string; // UUID
  owner_id: string; // UUID
  customer_id: string; // UUID
  check_in_date: string;
  check_out_date: string;
  booked_dates: string[];
  total_days: number;
  rent_per_day: number;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | string;
  // Relations (run-time only)
  room?: IRoom;
  hotel?: IHotel;
  owner?: IUser;
  customer?: IUser;
}

export interface IPayment {
  id: string; // UUID
  created_at: string;
  booking_id: string; // UUID
  customer_id: string; // UUID
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded" | string;
  payment_method?: string;
  stripe_payment_id?: string;
  stripe_invoice_id?: string;
  transaction_id?: string;
  // Relations (run-time only)
  booking?: IBooking;
  customer?: IUser;
}
