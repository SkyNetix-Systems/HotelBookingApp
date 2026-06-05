export const userRoles = [
  { value: "customer", label: "Customer" },
  { value: "owner", label: "Hotel Owner" },
  { value: "admin", label: "Administrator" },
];

export const cities = [
  { value: "new-york", label: "New York" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "chicago", label: "Chicago" },
  { value: "houston", label: "Houston" },
  { value: "miami", label: "Miami" },
  { value: "san-francisco", label: "San Francisco" },
  { value: "las-vegas", label: "Las Vegas" },
  { value: "orlando", label: "Orlando" },
  { value: "boston", label: "Boston" },
  { value: "seattle", label: "Seattle" },
];

export const roomTypes = [
  { value: "single", label: "Single Room" },
  { value: "double", label: "Double Room" },
  { value: "suite", label: "Suite" },
  { value: "family", label: "Family Room" },
  { value: "deluxe", label: "Deluxe Room" },
  { value: "presidential", label: "Presidential Suite" },
];

export const amenities = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "pool", label: "Swimming Pool" },
  { value: "gym", label: "Gym/Fitness Center" },
  { value: "spa", label: "Spa" },
  { value: "restaurant", label: "Restaurant" },
  { value: "bar", label: "Bar/Lounge" },
  { value: "parking", label: "Parking" },
  { value: "airport-shuttle", label: "Airport Shuttle" },
  { value: "pet-friendly", label: "Pet-Friendly" },
  { value: "room-service", label: "Room Service" },
];


export const roomStatuses = [
   {value : "active", label: "Active"},
   {value : "inactive", label: "Inactive"},
];


export const roomsSortOptions = [
  { value: "rent_per_day_asc", label: "Price: Low to High" },
  { value: "rent_per_day_desc", label: "Price: High to Low" },
  { value: "created_at_desc", label: "Newest First" },
  { value: "created_at_asc", label: "Oldest First" },
];