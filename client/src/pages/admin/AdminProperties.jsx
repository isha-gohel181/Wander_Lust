import React, { useState } from "react";
import { useAdminProperties } from "@/hooks/useAdminProperties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Trash2,
  Building2,
  MapPin,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminProperties = () => {
  const {
    properties,
    loading,
    pagination,
    filters,
    updatePropertyStatus,
    toggleFeatured,
    deleteProperty,
    bulkUpdateStatus,
    updateFilters,
    searchProperties,
    setPagination,
  } = useAdminProperties();

  const [selectedProperties, setSelectedProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    suspended: "bg-gray-100 text-gray-800",
  };

  const propertyTypes = [
    "apartment",
    "house",
    "villa",
    "condo",
    "townhouse",
    "cabin",
    "cottage",
    "loft",
    "studio",
    "other",
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProperties(properties.map((p) => p._id));
    } else {
      setSelectedProperties([]);
    }
  };

  const handleSelectProperty = (propertyId, checked) => {
    if (checked) {
      setSelectedProperties([...selectedProperties, propertyId]);
    } else {
      setSelectedProperties(
        selectedProperties.filter((id) => id !== propertyId)
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchProperties(searchTerm);
  };

  const handleBulkAction = (action) => {
    if (selectedProperties.length === 0) return;

    switch (action) {
      case "approve":
        bulkUpdateStatus(selectedProperties, "approved");
        break;
      case "reject":
        bulkUpdateStatus(selectedProperties, "rejected");
        break;
      case "suspend":
        bulkUpdateStatus(selectedProperties, "suspended");
        break;
    }
    setSelectedProperties([]);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Property Management
        </h1>
        <p className="text-gray-600">
          Manage all properties and their approval status.
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilters({ status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {/* Property Type Filter */}
            <Select
              value={filters.propertyType}
              onValueChange={(value) => updateFilters({ propertyType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Featured Filter */}
            <Select
              value={filters.featured}
              onValueChange={(value) => updateFilters({ featured: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="true">Featured Only</SelectItem>
                <SelectItem value="false">Non-Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedProperties.length} properties selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("suspend")}
                >
                  Suspend
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Properties List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Properties ({pagination.total})</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedProperties.length === properties.length &&
                  properties.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property._id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedProperties.includes(property._id)}
                    onCheckedChange={(checked) =>
                      handleSelectProperty(property._id, checked)
                    }
                  />

                  {/* Property Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {property.host?.firstName} {property.host?.lastName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.location?.city},{" "}
                            {property.location?.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(property.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            className={
                              statusColors[property.status] ||
                              statusColors.pending
                            }
                          >
                            {property.status || "pending"}
                          </Badge>
                          <Badge variant="outline">
                            {property.propertyType}
                          </Badge>
                          {property.featured && (
                            <Badge
                              variant="outline"
                              className="text-yellow-600"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <span className="text-sm font-medium text-green-600">
                            ₹{property.pricing?.basePrice}/night
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {property.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  updatePropertyStatus(property._id, "approved")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updatePropertyStatus(property._id, "rejected")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {property.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updatePropertyStatus(property._id, "suspended")
                              }
                            >
                              Suspend
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              toggleFeatured(property._id, !property.featured)
                            }
                          >
                            <Star className="h-4 w-4 mr-2" />
                            {property.featured ? "Unfeature" : "Feature"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Property</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this property?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                  onClick={() => deleteProperty(property._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {properties.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No properties found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} properties
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProperties;
