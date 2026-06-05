export interface IUser {
  id: number;
  created_at: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "owner" | "admin" | string;
  status: string;
}

export interface IHotel {
  id: number;
  created_at: string;
  name: string;
  description: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  images: string[];
  status: "approved" | "pending" | "rejected" | string;
  owner_id: number;
  // Relations (run-time only)
  owner?: IUser;
}

export interface IRoom {
  id: number;
  created_at: string;
  hotel_id: number;
  owner_id: number;
  name: string;
  description: string;
  type: string;
  rent_per_day: number;
  status: string;
  amenities: string[];
  images: string[];
  // Relations (run-time only)
  hotel?: IHotel;
  owner?: IUser;
}

export interface IBooking {
  id: number;
  created_at: string;
  room_id: number;
  hotel_id: number;
  owner_id: number;
  customer_id: number;
  booked_dates: string[];
  start_date: string;
  end_date: string;
  amount: number;
  payment_id: string;
  status: string;
  // Relations (run-time only)
  room?: IRoom;
  hotel?: IHotel;
  owner?: IUser;
  customer?: IUser;
}
