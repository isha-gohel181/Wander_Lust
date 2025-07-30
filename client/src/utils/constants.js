// client/src/utils/constants.js
export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "cabin", label: "Cabin" },
  { value: "cottage", label: "Cottage" },
  { value: "loft", label: "Loft" },
  { value: "studio", label: "Studio" },
  { value: "other", label: "Other" },
];

export const ROOM_TYPES = [
  { value: "entire_place", label: "Entire place" },
  { value: "private_room", label: "Private room" },
  { value: "shared_room", label: "Shared room" },
];

export const AMENITIES = [
  { value: "wifi", label: "WiFi", icon: "📶" },
  { value: "tv", label: "TV", icon: "📺" },
  { value: "kitchen", label: "Kitchen", icon: "🍳" },
  { value: "washer", label: "Washer", icon: "🧺" },
  { value: "free_parking", label: "Free parking", icon: "🚗" },
  { value: "paid_parking", label: "Paid parking", icon: "🅿️" },
  { value: "air_conditioning", label: "Air conditioning", icon: "❄️" },
  { value: "heating", label: "Heating", icon: "🔥" },
  { value: "pool", label: "Pool", icon: "🏊" },
  { value: "hot_tub", label: "Hot tub", icon: "🛁" },
  { value: "gym", label: "Gym", icon: "🏋️" },
  { value: "breakfast", label: "Breakfast", icon: "🥐" },
  { value: "laptop_workspace", label: "Laptop workspace", icon: "💻" },
  { value: "fireplace", label: "Fireplace", icon: "🔥" },
  { value: "iron", label: "Iron", icon: "👔" },
  { value: "hair_dryer", label: "Hair dryer", icon: "💨" },
  { value: "essentials", label: "Essentials", icon: "🧴" },
  { value: "shampoo", label: "Shampoo", icon: "🧴" },
  { value: "hangers", label: "Hangers", icon: "👔" },
  { value: "bed_linens", label: "Bed linens", icon: "🛏️" },
  { value: "extra_pillows", label: "Extra pillows", icon: "🛏️" },
  { value: "smoke_alarm", label: "Smoke alarm", icon: "🚨" },
  {
    value: "carbon_monoxide_alarm",
    label: "Carbon monoxide alarm",
    icon: "⚠️",
  },
  { value: "fire_extinguisher", label: "Fire extinguisher", icon: "🧯" },
  { value: "first_aid_kit", label: "First aid kit", icon: "🏥" },
];

export const BOOKING_STATUS = {
  pending: { label: "Pending", color: "yellow" },
  confirmed: { label: "Confirmed", color: "green" },
  cancelled_by_guest: { label: "Cancelled by Guest", color: "red" },
  cancelled_by_host: { label: "Cancelled by Host", color: "red" },
  completed: { label: "Completed", color: "blue" },
  no_show: { label: "No Show", color: "gray" },
};

// Admin Constants
export const USER_ROLES = {
  guest: { label: "Guest", color: "gray" },
  host: { label: "Host", color: "blue" },
  admin: { label: "Admin", color: "red" },
};

export const PROPERTY_STATUS = {
  pending: { label: "Pending Review", color: "yellow" },
  approved: { label: "Approved", color: "green" },
  rejected: { label: "Rejected", color: "red" },
  suspended: { label: "Suspended", color: "orange" },
};

export const REVIEW_STATUS = {
  pending: { label: "Pending", color: "yellow" },
  approved: { label: "Approved", color: "green" },
  rejected: { label: "Rejected", color: "red" },
  flagged: { label: "Flagged", color: "orange" },
};

export const ADMIN_PERMISSIONS = {
  USER_MANAGEMENT: "user_management",
  PROPERTY_MANAGEMENT: "property_management",
  BOOKING_MANAGEMENT: "booking_management",
  REVIEW_MANAGEMENT: "review_management",
  MESSAGE_MANAGEMENT: "message_management",
  ANALYTICS_VIEW: "analytics_view",
  SYSTEM_SETTINGS: "system_settings",
};

export const CURRENCY_SYMBOL = "$";
export const DEFAULT_CURRENCY = "INR";
