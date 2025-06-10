// client/src/hooks/useProperties.js
import { useState, useEffect, useCallback } from "react";
import { propertyService } from "../services/properties";
import { useDebounce } from "./useDebounce";
import toast from "react-hot-toast";

export const useProperties = (initialFilters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    city: "",
    state: "",
    country: "",
    propertyType: [],
    roomType: [],
    minPrice: "",
    maxPrice: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialFilters,
  });

  const debouncedFilters = useDebounce(filters, 500);

  const fetchProperties = useCallback(
    async (resetList = true) => {
      setLoading(true);
      setError(null);

      try {
        // Clean up filters - remove empty arrays and strings
        const cleanFilters = Object.entries(debouncedFilters).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              acc[key] = value.join(",");
            } else if (typeof value === "string" && value.trim()) {
              acc[key] = value.trim();
            } else if (typeof value === "number" && value > 0) {
              acc[key] = value;
            } else if (
              key === "page" ||
              key === "limit" ||
              key === "sortBy" ||
              key === "sortOrder"
            ) {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );

        const response = await propertyService.getProperties(cleanFilters);

        if (resetList || debouncedFilters.page === 1) {
          setProperties(response.properties);
        } else {
          setProperties((prev) => [...prev, ...response.properties]);
        }

        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    [debouncedFilters]
  );

  useEffect(() => {
    fetchProperties(true);
  }, [fetchProperties]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset to first page unless explicitly set
    }));
  }, []);

  const loadMore = useCallback(() => {
    if (pagination.hasNext && !loading) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.hasNext, loading]);

  const refresh = useCallback(() => {
    fetchProperties(true);
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadMore,
    refresh,
  };
};
