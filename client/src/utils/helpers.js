// client/src/utils/helpers.js
import { format, formatDistanceToNow } from "date-fns";

export const formatPrice = (price, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date, formatString = "MMM dd, yyyy") => {
  if (!date) return "";
  return format(new Date(date), formatString);
};

export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, "MMM dd")} - ${format(end, "dd, yyyy")}`;
    }
    return `${format(start, "MMM dd")} - ${format(end, "MMM dd, yyyy")}`;
  }

  return `${format(start, "MMM dd, yyyy")} - ${format(end, "MMM dd, yyyy")}`;
};

export const formatTimeAgo = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateTotalPrice = (
  basePrice,
  nights,
  cleaningFee = 0,
  serviceFeePercent = 14,
  taxPercent = 8
) => {
  const subtotal = basePrice * nights;
  const serviceFee = Math.round(subtotal * (serviceFeePercent / 100));
  const taxes = Math.round(
    (subtotal + cleaningFee + serviceFee) * (taxPercent / 100)
  );
  const total = subtotal + cleaningFee + serviceFee + taxes;

  return {
    subtotal,
    cleaningFee,
    serviceFee,
    taxes,
    total,
  };
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const getAmenityIcon = (amenity) => {
  const amenityMap = {
    wifi: "📶",
    tv: "📺",
    kitchen: "🍳",
    washer: "🧺",
    free_parking: "🚗",
    paid_parking: "🅿️",
    air_conditioning: "❄️",
    heating: "🔥",
    pool: "🏊",
    hot_tub: "🛁",
    gym: "🏋️",
    breakfast: "🥐",
    laptop_workspace: "💻",
    fireplace: "🔥",
    iron: "👔",
    hair_dryer: "💨",
    essentials: "🧴",
    shampoo: "🧴",
    hangers: "👔",
    bed_linens: "🛏️",
    extra_pillows: "🛏️",
    smoke_alarm: "🚨",
    carbon_monoxide_alarm: "⚠️",
    fire_extinguisher: "🧯",
    first_aid_kit: "🏥",
  };

  return amenityMap[amenity] || "✅";
};

export const extractPublicId = (imageUrl) => {
  try {
    const parts = imageUrl.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex !== -1 && uploadIndex < parts.length - 1) {
      let startIndex = uploadIndex + 1;

      // Skip version like v123456
      if (parts[startIndex].startsWith("v")) {
        startIndex += 1;
      }

      const publicIdWithExt = parts.slice(startIndex).join("/");
      const publicId = publicIdWithExt.split(".")[0]; // Remove file extension
      return publicId;
    }

    return null;
  } catch (err) {
    console.error("Error extracting public ID:", err);
    return null;
  }
};
