import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  MapPin,
  Home,
  Users,
  Camera,
  Trash2,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { propertyService } from "@/services/properties";
import { uploadService } from "@/services/upload";
import { extractPublicId } from "@/utils/helpers";
import ImageUpload from "@/components/property/ImageUpload";
import { PROPERTY_TYPES, ROOM_TYPES, AMENITIES } from "@/utils/constants";
import toast from "react-hot-toast";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    roomType: "",
    accommodates: 1,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      coordinates: { lat: 0, lng: 0 },
    },
    pricing: {
      basePrice: 0,
      cleaningFee: 0,
      serviceFee:0,
    },
    amenities: [],
    images: [],
    isActive: true,
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await propertyService.getProperty(id);
      setProperty(data);
      setFormData({
        title: data.title,
        description: data.description,
        propertyType: data.propertyType,
        roomType: data.roomType,
        accommodates: data.accommodates,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        beds: data.beds || 1,
        location: {
          address: data.location.address,
          city: data.location.city,
          state: data.location.state,
          country: data.location.country,
          zipCode: data.location.zipCode,
          coordinates: data.location.coordinates,
        },
        pricing: {
          basePrice: data.pricing.basePrice,
          cleaningFee: data.pricing.cleaningFee || 0,
          serviceFee: data.pricing.serviceFee || 0,
        },
        amenities: data.amenities || [],
        images: data.images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          isPrimary: img.isPrimary,
          uploaded: true,
          id: img.publicId || `existing-${Date.now()}-${Math.random()}`,
        })),
        isActive: data.isActive,
      });
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch property details");
      navigate("/dashboard/properties");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleImagesChange = useCallback((images) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  }, []);

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Updated image upload function based on AddProperty.jsx logic
  const uploadImages = async (images) => {
    if (!images || images.length === 0) return [];

    try {
      // Filter only images that need to be uploaded (have file property and not already uploaded)
      const imagesToUpload = images.filter((img) => img.file && !img.uploaded);

      // If no new images to upload, return existing uploaded image URLs
      if (imagesToUpload.length === 0) {
        return images.filter((img) => img.uploaded).map((img) => img.url);
      }

      // Compress images if they're larger than 1MB
      const compressedImages = await Promise.all(
        imagesToUpload.map(async (img) => {
          if (img.file.size > 1024 * 1024) {
            return await uploadService.compressImage(img.file);
          }
          return img.file;
        })
      );

      // Upload compressed images with progress tracking
      const uploadResponse = await uploadService.uploadImagesWithProgress(
        compressedImages,
        "properties",
        setUploadProgress
      );

      // Combine existing and new image URLs
      const existingUrls = images
        .filter((img) => img.uploaded)
        .map((img) => img.url);

      return [...existingUrls, ...uploadResponse.imageUrls];
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploadProgress(0);

    try {
      // Validate required fields before submission
      if (!formData.title || formData.title.trim().length < 5) {
        toast.error("Title must be at least 5 characters long");
        setSaving(false);
        return;
      }

      if (!formData.description || formData.description.trim().length < 50) {
        toast.error("Description must be at least 50 characters long");
        setSaving(false);
        return;
      }

      // Validate images - at least one image required
      if (!formData.images.length) {
        toast.error("Please add at least one image");
        setSaving(false);
        return;
      }

      toast.loading("Updating property...");

      // Handle any new image uploads
      const imageUrls = await uploadImages(formData.images);

      // Prepare the update payload with proper data types
      const updateData = {
        ...formData,
        accommodates: Number(formData.accommodates),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        beds: Number(formData.beds),
        pricing: {
          ...formData.pricing,
          basePrice: Number(formData.pricing.basePrice),
          cleaningFee: Number(formData.pricing.cleaningFee || 0),
          serviceFee: Number(formData.pricing.serviceFee || 0),
        },
        images: imageUrls.map((url, index) => ({
          url,
          publicId: extractPublicId(url),
          isPrimary: index === 0,
        })),
      };

      // Update the property
      await propertyService.updateProperty(id, updateData);
      toast.dismiss();
      toast.success("Property updated successfully");
      navigate("/dashboard/properties");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to update property");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/properties")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Property</h1>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {saving && uploadProgress > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading images...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                minLength={5}
                maxLength={100}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                required
                minLength={50}
                maxLength={1000}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) =>
                    handleInputChange("propertyType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Room Type</Label>
                <Select
                  value={formData.roomType}
                  onValueChange={(value) =>
                    handleInputChange("roomType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Accommodates</Label>
                <Input
                  type="number"
                  value={formData.accommodates}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleInputChange("accommodates", Math.max(1, value));
                  }}
                  min="1"
                  max="20"
                  required
                />
              </div>
              <div>
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleInputChange("bedrooms", Math.max(0, value));
                  }}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0.5;
                    handleInputChange("bathrooms", Math.max(0.5, value));
                  }}
                  min="0.5"
                  required
                />
              </div>
              <div>
                <Label>Beds</Label>
                <Input
                  type="number"
                  value={formData.beds}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleInputChange("beds", Math.max(1, value));
                  }}
                  min="1"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Add high-quality photos of your property. The first photo will
                be the main image. Only image files are allowed (JPEG, PNG, GIF,
                WebP).
              </p>
              <ImageUpload
                images={formData.images}
                onImagesChange={handleImagesChange}
                maxImages={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Address</Label>
              <Input
                value={formData.location.address}
                onChange={(e) =>
                  handleInputChange("location.address", e.target.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={formData.location.city}
                  onChange={(e) =>
                    handleInputChange("location.city", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={formData.location.state}
                  onChange={(e) =>
                    handleInputChange("location.state", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Country</Label>
                <Input
                  value={formData.location.country}
                  onChange={(e) =>
                    handleInputChange("location.country", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>ZIP Code</Label>
                <Input
                  value={formData.location.zipCode}
                  onChange={(e) =>
                    handleInputChange("location.zipCode", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
                  
        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AMENITIES.map((amenity) => (
                <div
                  key={amenity.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={amenity.value}
                    checked={formData.amenities.includes(amenity.value)}
                    onCheckedChange={() => handleAmenityToggle(amenity.value)}
                  />
                  <Label htmlFor={amenity.value}>{amenity.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Base Price (per night)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="number"
                    value={formData.pricing.basePrice}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      handleInputChange(
                        "pricing.basePrice",
                        Math.max(1, value)
                      );
                    }}
                    className="pl-10"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Cleaning Fee</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="number"
                    value={formData.pricing.cleaningFee}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      handleInputChange(
                        "pricing.cleaningFee",
                        Math.max(0, value)
                      );
                    }}
                    className="pl-10"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <Label>Service Fee</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="number"
                    value={formData.pricing.serviceFee}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      handleInputChange(
                        "pricing.serviceFee",
                        Math.max(0, value)
                      );
                    }}
                    className="pl-10"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/properties")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
