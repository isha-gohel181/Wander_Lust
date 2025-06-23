//client/src/pages/search.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import FilterSidebar from "@/components/search/FilterSidebar";
import PropertyGrid from "@/components/property/PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
import { useWishlist } from "@/hooks/useWishlist";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: [],
    roomType: [],
    priceRange: [0, 80000], // INR range
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
  });

  // Initialize search from URL params
  const initialFilters = {
    search: searchParams.get("destination") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "",
    // Map the filter structure to what useProperties expects
    propertyType: [],
    roomType: [],
    minPrice: 0,
    maxPrice: 80000,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
  };

  const { properties, loading, pagination, updateFilters, loadMore } =
    useProperties(initialFilters);

  const { toggleWishlist, wishlistIds } = useWishlist();

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

  // Update filters when URL params change
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get("destination") || "",
      checkIn: searchParams.get("checkIn") || "",
      checkOut: searchParams.get("checkOut") || "",
      guests: searchParams.get("guests") || "",
    };
    updateFilters(urlFilters);
  }, [searchParams, updateFilters]);

  const handleFiltersUpdate = (newFilters) => {
    setFilters(newFilters);

    // Convert filter structure for useProperties hook
    const propertyFilters = {
      ...newFilters,
      minPrice: newFilters.priceRange ? newFilters.priceRange[0] : 0,
      maxPrice: newFilters.priceRange ? newFilters.priceRange[1] : 80000,
    };

    // Remove priceRange as it's converted to minPrice/maxPrice
    delete propertyFilters.priceRange;

    updateFilters(propertyFilters);
  };

  const getActiveFiltersCount = () => {
    // Ensure all properties exist with defaults
    const {
      propertyType = [],
      roomType = [],
      amenities = [],
      priceRange = [0, 80000],
      bedrooms = 0,
      bathrooms = 0,
    } = filters || {};

    return (
      propertyType.length +
      roomType.length +
      amenities.length +
      (bedrooms > 0 ? 1 : 0) +
      (bathrooms > 0 ? 1 : 0) +
      (priceRange[0] > 0 || priceRange[1] < 80000 ? 1 : 0)
    );
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      propertyType: [],
      roomType: [],
      priceRange: [0, 80000],
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
    };
    setFilters(clearedFilters);

    // Also clear in the properties hook
    updateFilters({
      propertyType: [],
      roomType: [],
      minPrice: 0,
      maxPrice: 80000,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
    });
  };

  // Safe accessors for rendering active filters
  const safeFilters = {
    propertyType: filters?.propertyType || [],
    roomType: filters?.roomType || [],
    amenities: filters?.amenities || [],
    priceRange: filters?.priceRange || [0, 80000],
    bedrooms: filters?.bedrooms || 0,
    bathrooms: filters?.bathrooms || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Results count */}
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                {pagination?.totalCount || 0} properties found
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Filter Button */}
              <Sheet
                open={isMobileFilterOpen}
                onOpenChange={setIsMobileFilterOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Filters</span>
                    {getActiveFiltersCount() > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs"
                      >
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[85vw] sm:w-80 p-0 overflow-y-auto max-h-screen"
                >
                  {/* Accessible Title and Description */}
                  <SheetTitle className="sr-only">Filters</SheetTitle>
                  <SheetDescription className="sr-only">
                    Use filters to narrow your property search.
                  </SheetDescription>

                  <FilterSidebar
                    filters={filters}
                    updateFilters={handleFiltersUpdate}
                    onClose={() => setIsMobileFilterOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              {/* Desktop Filter Button */}
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 mt-3 flex-wrap">
              <span className="text-xs sm:text-sm text-gray-600">Filters:</span>

              {safeFilters.propertyType.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="capitalize text-xs py-0.5 px-2"
                >
                  {type.replace("_", " ")}
                </Badge>
              ))}

              {safeFilters.roomType.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="capitalize text-xs py-0.5 px-2"
                >
                  {type.replace("_", " ")}
                </Badge>
              ))}

              {(safeFilters.priceRange[0] > 0 ||
                safeFilters.priceRange[1] < 80000) && (
                <Badge variant="secondary" className="text-xs py-0.5 px-2">
                  {formatRupees(safeFilters.priceRange[0])} -{" "}
                  {formatRupees(safeFilters.priceRange[1])}+
                </Badge>
              )}

              {safeFilters.bedrooms > 0 && (
                <Badge variant="secondary" className="text-xs py-0.5 px-2">
                  {safeFilters.bedrooms}+ bed
                </Badge>
              )}

              {safeFilters.bathrooms > 0 && (
                <Badge variant="secondary" className="text-xs py-0.5 px-2">
                  {safeFilters.bathrooms}+ bath
                </Badge>
              )}

              {safeFilters.amenities.slice(0, 1).map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="capitalize text-xs py-0.5 px-2"
                >
                  {amenity.replace("_", " ")}
                </Badge>
              ))}

              {safeFilters.amenities.length > 1 && (
                <Badge variant="secondary" className="text-xs py-0.5 px-2">
                  +{safeFilters.amenities.length - 1} more
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-wanderlust-600 hover:text-wanderlust-700 text-xs sm:text-sm h-6 px-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          {/* <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar
                filters={filters}
                updateFilters={handleFiltersUpdate}
                className="border border-gray-200 rounded-lg shadow-sm"
              />
            </div>
          </div> */}

          {/* Properties Grid */}
          <div className="flex-1">
            <PropertyGrid
              properties={properties || []}
              loading={loading}
              hasMore={pagination?.hasNext || false}
              onLoadMore={loadMore}
              onWishlistToggle={toggleWishlist}
              wishlist={wishlistIds || new Set()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
