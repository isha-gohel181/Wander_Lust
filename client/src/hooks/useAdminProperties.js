import { useState, useEffect } from "react";
import { adminService } from "@/services/admin";
import toast from "react-hot-toast";

export const useAdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    status: "all",
    propertyType: "all",
    featured: "all",
    search: "",
  });

  useEffect(() => {
    fetchProperties();
  }, [pagination.page, filters]);

  const fetchProperties = async (page = pagination.page) => {
    try {
      setLoading(true);
      const data = await adminService.getAllProperties(
        page,
        pagination.limit,
        filters
      );
      setProperties(data.properties);
      setPagination({
        ...pagination,
        page: data.pagination.page,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyStatus = async (propertyId, status) => {
    try {
      await adminService.updatePropertyStatus(propertyId, status);
      toast.success(`Property ${status} successfully`);
      fetchProperties(); // Refresh the list
    } catch (err) {
      toast.error(`Failed to ${status} property`);
    }
  };

  const toggleFeatured = async (propertyId, featured) => {
    try {
      await adminService.togglePropertyFeatured(propertyId, featured);
      toast.success(
        featured ? "Property featured successfully" : "Property unfeatured"
      );
      fetchProperties(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update featured status");
    }
  };

  const deleteProperty = async (propertyId) => {
    try {
      await adminService.deleteProperty(propertyId);
      toast.success("Property deleted successfully");
      fetchProperties(); // Refresh the list
    } catch (err) {
      toast.error("Failed to delete property");
    }
  };

  const bulkUpdateStatus = async (propertyIds, status) => {
    try {
      await adminService.bulkUpdateProperties(propertyIds, { status });
      toast.success(`${propertyIds.length} properties updated successfully`);
      fetchProperties(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update properties");
    }
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 });
  };

  const searchProperties = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  return {
    properties,
    loading,
    error,
    pagination,
    filters,
    updatePropertyStatus,
    toggleFeatured,
    deleteProperty,
    bulkUpdateStatus,
    updateFilters,
    searchProperties,
    fetchProperties,
    setPagination,
  };
};
