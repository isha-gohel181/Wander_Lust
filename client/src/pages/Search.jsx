//client/src/pages/search.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-600">
              {pagination?.totalCount || 0} properties found
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative rounded-full border-orange-200 bg-white px-4 text-gray-700 shadow-sm hover:border-orange-300 hover:bg-orange-50 hover:text-gray-900"
                >
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-wanderlust-500" />
                  <span className="text-xs sm:text-sm font-medium">Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs bg-wanderlust-500 text-white shadow-md"
                    >
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[90vw] sm:w-[24rem] p-0 overflow-hidden max-h-screen border-r-0 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)] rounded-r-[1.5rem]"
              >
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

            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="rounded-full text-wanderlust-600 hover:bg-wanderlust-50 hover:text-wanderlust-700 text-xs sm:text-sm"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

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
  );
};

export default Search;
