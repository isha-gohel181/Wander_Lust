// client/src/components/search/FilterSidebar.jsx
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const FilterSidebar = ({
  filters = {},
  updateFilters,
  onClose,
  className = "",
}) => {
  // Provide default values for all filter properties
  const {
    propertyType = [],
    roomType = [],
    priceRange = [0, 1000],
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
      priceRange: [0, 1000],
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
    });
  };

  return (
    <div className={`bg-white h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Price Range */}
        <div>
          <h3 className="text-base font-semibold mb-4">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value })}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}+</span>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h3 className="text-base font-semibold mb-4">Property Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={propertyType.includes(type.value)}
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
                <Label htmlFor={type.value} className="text-sm cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div>
          <h3 className="text-base font-semibold mb-4">Room Type</h3>
          <div className="space-y-3">
            {roomTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`room-${type.value}`}
                  checked={roomType.includes(type.value)}
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
                  className="text-sm cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div>
          <h3 className="text-base font-semibold mb-4">Rooms</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Bedrooms</Label>
              <div className="flex items-center space-x-2 mt-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    variant={bedrooms === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters({ bedrooms: num })}
                    className="h-8 w-8 p-0"
                  >
                    {num === 0 ? "Any" : num === 5 ? "5+" : num}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm">Bathrooms</Label>
              <div className="flex items-center space-x-2 mt-2">
                {[0, 1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant={bathrooms === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters({ bathrooms: num })}
                    className="h-8 w-8 p-0"
                  >
                    {num === 0 ? "Any" : num === 4 ? "4+" : num}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-base font-semibold mb-4">Amenities</h3>
          <div className="grid grid-cols-1 gap-3">
            {amenitiesList.map((amenity) => (
              <div key={amenity.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity.value}`}
                  checked={amenities.includes(amenity.value)}
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
                  className="text-sm cursor-pointer"
                >
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t space-y-3">
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All
        </Button>
        <Button
          onClick={onClose}
          className="w-full bg-wanderlust-500 hover:bg-wanderlust-600"
        >
          Show Results
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
