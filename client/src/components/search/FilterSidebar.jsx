// client/src/components/search/FilterSidebar.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const FilterSidebar = ({
  filters = {},
  updateFilters,
  onClose,
  className = "",
}) => {
  // Provide default values for all filter properties (updated to rupee range)
  const {
    propertyType = [],
    roomType = [],
    priceRange = [0, 80000], // Updated from [0, 1000] to INR range
    bedrooms = 0,
    bathrooms = 0,
    amenities = [],
  } = filters;
 
  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "cabin", label: "Cabin" },
    { value: "cottage", label: "Cottage" },
    { value: "loft", label: "Loft" },
    { value: "studio", label: "Studio" },
  ];

  const roomTypes = [
    { value: "entire_place", label: "Entire place" },
    { value: "private_room", label: "Private room" },
    { value: "shared_room", label: "Shared room" },
  ];

  const amenitiesList = [
    { value: "wifi", label: "WiFi" },
    { value: "kitchen", label: "Kitchen" },
    { value: "washer", label: "Washer" },
    { value: "free_parking", label: "Free parking" },
    { value: "air_conditioning", label: "Air conditioning" },
    { value: "pool", label: "Pool" },
    { value: "hot_tub", label: "Hot tub" },
    { value: "gym", label: "Gym" },
    { value: "breakfast", label: "Breakfast" },
    { value: "laptop_workspace", label: "Workspace" },
  ];

  const clearFilters = () => {
    updateFilters({
      propertyType: [],
      roomType: [],
      priceRange: [0, 80000], // Updated to INR range
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
    });
  };

  // Function to format rupee values
  const formatRupees = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`; // Lakh format
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`; // Thousand format
    } else {
      return `₹${value}`;
    }
  };

  return (
    <div className={`bg-white h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50 via-white to-white px-5 py-5 sm:px-6">
        <div className="flex items-center justify-start gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">
            Filters
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 space-y-8">
        {/* Price Range */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Price range</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value })}
              max={80000} // Updated from 1000 to 80000 INR
              min={0}
              step={1000} // Updated from 10 to 1000 for better INR steps
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatRupees(priceRange[0])}</span>
              <span>{formatRupees(priceRange[1])}+</span>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Property type</h3>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <div
                key={type.value}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition-all ${
                  propertyType.includes(type.value)
                    ? "border-wanderlust-200 bg-wanderlust-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/60"
                }`}
              >
                <Checkbox
                  id={type.value}
                  checked={propertyType.includes(type.value)}
                  className="border-gray-300 data-[state=checked]:!border-wanderlust-500 data-[state=checked]:!bg-wanderlust-500 focus-visible:!ring-wanderlust-200"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({
                        propertyType: [...propertyType, type.value],
                      });
                    } else {
                      updateFilters({
                        propertyType: propertyType.filter(
                          (t) => t !== type.value
                        ),
                      });
                    }
                  }}
                />
                <Label htmlFor={type.value} className="cursor-pointer text-sm font-medium text-gray-700">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Room type</h3>
          <div className="space-y-3">
            {roomTypes.map((type) => (
              <div
                key={type.value}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition-all ${
                  roomType.includes(type.value)
                    ? "border-wanderlust-200 bg-wanderlust-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/60"
                }`}
              >
                <Checkbox
                  id={`room-${type.value}`}
                  checked={roomType.includes(type.value)}
                  className="border-gray-300 data-[state=checked]:!border-wanderlust-500 data-[state=checked]:!bg-wanderlust-500 focus-visible:!ring-wanderlust-200"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({
                        roomType: [...roomType, type.value],
                      });
                    } else {
                      updateFilters({
                        roomType: roomType.filter((t) => t !== type.value),
                      });
                    }
                  }}
                />
                <Label
                  htmlFor={`room-${type.value}`}
                  className="cursor-pointer text-sm font-medium text-gray-700"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Rooms</h3>
          <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
            <div>
              <Label className="text-sm font-medium text-gray-700">Bedrooms</Label>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ bedrooms: num })}
                    className={`h-9 rounded-full px-4 transition-all ${
                      bedrooms === num
                        ? "border-wanderlust-500 bg-wanderlust-500 text-white hover:bg-wanderlust-600 hover:text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50 hover:text-gray-900"
                    }`}
                  >
                    {num === 0 ? "Any" : num === 5 ? "5+" : num}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Bathrooms</Label>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {[0, 1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ bathrooms: num })}
                    className={`h-9 rounded-full px-4 transition-all ${
                      bathrooms === num
                        ? "border-wanderlust-500 bg-wanderlust-500 text-white hover:bg-wanderlust-600 hover:text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50 hover:text-gray-900"
                    }`}
                  >
                    {num === 0 ? "Any" : num === 4 ? "4+" : num}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Amenities</h3>
          <div className="grid grid-cols-1 gap-3">
            {amenitiesList.map((amenity) => (
              <div
                key={amenity.value}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition-all ${
                  amenities.includes(amenity.value)
                    ? "border-wanderlust-200 bg-wanderlust-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/60"
                }`}
              >
                <Checkbox
                  id={`amenity-${amenity.value}`}
                  checked={amenities.includes(amenity.value)}
                  className="border-gray-300 data-[state=checked]:!border-wanderlust-500 data-[state=checked]:!bg-wanderlust-500 focus-visible:!ring-wanderlust-200"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({
                        amenities: [...amenities, amenity.value],
                      });
                    } else {
                      updateFilters({
                        amenities: amenities.filter((a) => a !== amenity.value),
                      });
                    }
                  }}
                />
                <Label
                  htmlFor={`amenity-${amenity.value}`}
                  className="cursor-pointer text-sm font-medium text-gray-700"
                >
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-white p-5 space-y-3">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full rounded-full border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50"
        >
          Clear All
        </Button>
        <Button
          onClick={onClose}
          className="w-full rounded-full bg-wanderlust-500 shadow-lg shadow-wanderlust-500/20 hover:bg-wanderlust-600"
        >
          Show Results
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
