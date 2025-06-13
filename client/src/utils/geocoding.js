import { toast } from "react-hot-toast";

// Constants
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const DEBOUNCE_DELAY = 1000; // 1 second
const geocodeCache = new Map();
let debounceTimer;

/**
 * Forward geocoding using Nominatim
 */
export const nominatimGeocode = async (address) => {
  if (!address) {
    throw new Error("Address is required");
  }

  const cleanedAddress = address.trim().toLowerCase();
  const cacheKey = `geocode:${cleanedAddress}`;

  // Check cache
  const cached = geocodeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Add delay to respect Nominatim usage policy
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(cleanedAddress)}` +
        `&addressdetails=1&limit=1`,
      {
        headers: {
          "User-Agent": "Wanderlust_Property_App/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      const geocoded = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formattedAddress: result.display_name,
        addressComponents: parseNominatimAddress(result.address),
      };

      // Cache the result
      geocodeCache.set(cacheKey, {
        data: geocoded,
        timestamp: Date.now(),
      });

      return geocoded;
    }

    throw new Error("Location not found");
  } catch (error) {
    console.error("Geocoding error:", error);
    toast.error("Unable to find location");
    throw error;
  }
};

/**
 * Reverse geocoding using Nominatim
 */
export const nominatimReverseGeocode = async ({ lat, lng }) => {
  const cacheKey = `reverse:${lat},${lng}`;

  // Check cache
  const cached = geocodeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Add delay to respect Nominatim usage policy
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Wanderlust_Property_App/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data) {
      const result = {
        ...parseNominatimAddress(data.address),
        formattedAddress: data.display_name,
      };

      // Cache the result
      geocodeCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    }

    throw new Error("Address not found");
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    toast.error("Unable to find address for this location");
    throw error;
  }
};

/**
 * Parse address components from Nominatim response
 */
const parseNominatimAddress = (address) => {
  if (!address) return {};

  return {
    streetNumber: address.house_number || "",
    street: address.road || address.street || "",
    city: address.city || address.town || address.village || "",
    state: address.state || "",
    country: address.country || "",
    zipCode: address.postcode || "",
  };
};

/**
 * Format address components into a string
 */
export const formatAddress = (components) => {
  if (!components) return "";

  const { streetNumber, street, city, state, zipCode, country } = components;

  const streetAddress = [streetNumber, street].filter(Boolean).join(" ");
  const cityStateZip = [city, state, zipCode].filter(Boolean).join(", ");

  return [streetAddress, cityStateZip, country].filter(Boolean).join(", ");
};

// Default values
export const DEFAULT_LOCATION = {
  lat: 40.7128,
  lng: -74.006,
};

export const DEFAULT_ADDRESS = {
  streetNumber: "",
  street: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
};

// Last updated: 2025-06-12 11:24:24
// Author: isha-gohel181
