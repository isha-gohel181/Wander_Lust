// client/src/pages/Search.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "@/components/search/SearchBar";
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
    priceRange: [0, 1000],
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
    ...filters,
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
    updateFilters(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.propertyType.length > 0) count++;
    if (filters.roomType.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.bedrooms > 0) count++;
    if (filters.bathrooms > 0) count++;
    if (filters.amenities.length > 0) count++;
    return count;
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      propertyType: [],
      roomType: [],
      priceRange: [0, 1000],
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
    };
    setFilters(clearedFilters);
    updateFilters(clearedFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="lg:hidden mb-4">
            <SearchBar />
          </div>

          <div className="flex items-center justify-between">
            <div className="hidden lg:flex flex-1 max-w-2xl">
              <SearchBar />
            </div>

            <div className="flex items-center space-x-4">
              {/* Results count */}
              <span className="text-sm text-gray-600">
                {pagination.totalCount} properties found
              </span>

              {/* Mobile Filter Button */}
              <Sheet
                open={isMobileFilterOpen}
                onOpenChange={setIsMobileFilterOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden relative"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <FilterSidebar
                    filters={filters}
                    updateFilters={handleFiltersUpdate}
                    onClose={() => setIsMobileFilterOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              {/* Desktop Filter Toggle */}
              <Button variant="outline" size="sm" className="hidden lg:flex">
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
            <div className="flex items-center space-x-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>

              {filters.propertyType.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type.replace("_", " ")}
                </Badge>
              ))}

              {filters.roomType.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type.replace("_", " ")}
                </Badge>
              ))}

              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                <Badge variant="secondary">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}+
                </Badge>
              )}

              {filters.bedrooms > 0 && (
                <Badge variant="secondary">{filters.bedrooms}+ bedrooms</Badge>
              )}

              {filters.bathrooms > 0 && (
                <Badge variant="secondary">
                  {filters.bathrooms}+ bathrooms
                </Badge>
              )}

              {filters.amenities.slice(0, 2).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="capitalize">
                  {amenity.replace("_", " ")}
                </Badge>
              ))}

              {filters.amenities.length > 2 && (
                <Badge variant="secondary">
                  +{filters.amenities.length - 2} more amenities
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-wanderlust-600 hover:text-wanderlust-700"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar
                filters={filters}
                updateFilters={handleFiltersUpdate}
                className="border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <PropertyGrid
              properties={properties}
              loading={loading}
              hasMore={pagination.hasNext}
              onLoadMore={loadMore}
              onWishlistToggle={toggleWishlist}
              wishlist={wishlistIds}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
