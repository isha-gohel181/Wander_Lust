// client/src/pages/dashboard/MyProperties.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProperties } from "@/hooks/useProperties";
import { propertyService } from "@/services/properties";
import { formatPrice, formatTimeAgo } from "@/utils/helpers";
import toast from "react-hot-toast";

const MyProperties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostProperties();
  }, []);

  const fetchHostProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getHostProperties();
      setProperties(data);
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await propertyService.deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      toast.success("Property deleted successfully");
    } catch (error) {
      toast.error("Failed to delete property");
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <Link to="/dashboard/properties/new">
          <Button className="bg-wanderlust-500 hover:bg-wanderlust-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            {searchTerm ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search term
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start earning by adding your first property listing
                </p>
                <Link to="/dashboard/properties/new">
                  <Button className="bg-wanderlust-500 hover:bg-wanderlust-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card
              key={property._id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                <div className="absolute top-3 left-3">
                  <Badge variant={property.isActive ? "default" : "secondary"}>
                    {property.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/property/${property._id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/dashboard/properties/${property._id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteProperty(property._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {property.title}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {property.location.city}, {property.location.state}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold">
                    {formatPrice(property.pricing?.basePrice)}
                    <span className="text-sm font-normal text-gray-600">
                      {" "}
                      /night
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{property.accommodates} guests</span>
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created {formatTimeAgo(property.createdAt)}</span>
                    <span>{property.bookingCount || 0} bookings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
