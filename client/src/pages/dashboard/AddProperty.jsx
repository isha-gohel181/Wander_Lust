// client/src/pages/dashboard/AddProperty.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  MapPin,
  DollarSign,
  Home,
  Users,
  Camera,
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
import { propertyService } from "@/services/properties";
import { uploadService } from "@/services/upload";
import { PROPERTY_TYPES, ROOM_TYPES, AMENITIES } from "@/utils/constants";
import { extractPublicId } from "@/utils/helpers"; // If using alias
import ImageUpload from "@/components/property/ImageUpload";
import toast from "react-hot-toast";

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [propertyData, setPropertyData] = useState({
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
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    pricing: {
      basePrice: 50,
      cleaningFee: 0,
      currency: "USD",
    },
    amenities: [],
    images: [], // Added images array
    houseRules: {
      checkInTime: "15:00",
      checkOutTime: "11:00",
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
    },
  });

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setPropertyData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setPropertyData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleLocationChange = (field, value) => {
    setPropertyData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setPropertyData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImagesChange = (images) => {
    setPropertyData((prev) => ({
      ...prev,
      images: images,
    }));
  };

  // Enhanced validation function
  const validatePropertyData = (data) => {
    const errors = [];

    // Basic info validation
    if (!data.title || data.title.trim().length < 5) {
      errors.push("Title must be at least 5 characters long");
    }
    if (!data.description || data.description.trim().length < 50) {
      errors.push("Description must be at least 50 characters long");
    }
    if (!data.propertyType) {
      errors.push("Property type is required");
    }
    if (!data.roomType) {
      errors.push("Room type is required");
    }

    // Location validation
    if (!data.location.address?.trim()) {
      errors.push("Address is required");
    }
    if (!data.location.city?.trim()) {
      errors.push("City is required");
    }
    if (!data.location.state?.trim()) {
      errors.push("State is required");
    }
    if (!data.location.country?.trim()) {
      errors.push("Country is required");
    }
    if (!data.location.zipCode?.trim()) {
      errors.push("ZIP code is required");
    }

    // Numeric validation
    if (isNaN(data.accommodates) || data.accommodates < 1) {
      errors.push("Number of guests must be at least 1");
    }
    if (isNaN(data.bedrooms) || data.bedrooms < 0) {
      errors.push("Bedrooms must be 0 or more");
    }
    if (isNaN(data.bathrooms) || data.bathrooms < 0.5) {
      errors.push("Bathrooms must be at least 0.5");
    }
    if (isNaN(data.beds) || data.beds < 1) {
      errors.push("Number of beds must be at least 1");
    }
    if (isNaN(data.pricing.basePrice) || data.pricing.basePrice < 1) {
      errors.push("Base price must be at least $1");
    }

    // Image validation
    if (!data.images || data.images.length < 1) {
      errors.push("At least 1 property image is required");
    }

    return errors;
  };

  const uploadImages = async (images) => {
    if (!images || images.length === 0) return [];

    try {
      // Filter only new images that haven't been uploaded
      const imagesToUpload = images.filter((img) => img.file && !img.uploaded);

      if (imagesToUpload.length === 0) {
        return images.filter((img) => img.uploaded).map((img) => img.url);
      }

      // Compress images before upload
      const compressedImages = await Promise.all(
        imagesToUpload.map(async (img) => {
          if (img.file.size > 1024 * 1024) {
            // If larger than 1MB
            return await uploadService.compressImage(img.file);
          }
          return img.file;
        })
      );

      // Upload with progress tracking
      const uploadResponse = await uploadService.uploadImagesWithProgress(
        compressedImages,
        "properties",
        setUploadProgress
      );

      // Return all image URLs (existing + newly uploaded)
      const existingUrls = images
        .filter((img) => img.uploaded)
        .map((img) => img.url);
      return [...existingUrls, ...uploadResponse.imageUrls];
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  const handleSubmit = async () => {
    // Validate data before submission
    const validationErrors = validatePropertyData(propertyData);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Upload images first
      toast.loading("Uploading images...", { id: "upload" });
      const imageUrls = await uploadImages(propertyData.images);
      toast.success("Images uploaded successfully!", { id: "upload" });

      // Prepare property data
      const propertyWithCoords = {
        ...propertyData,
        // Ensure numeric fields are numbers, not strings
        accommodates: Number(propertyData.accommodates),
        bedrooms: Number(propertyData.bedrooms),
        bathrooms: Number(propertyData.bathrooms),
        beds: Number(propertyData.beds),
        pricing: {
          ...propertyData.pricing,
          basePrice: Number(propertyData.pricing.basePrice),
          cleaningFee: Number(propertyData.pricing.cleaningFee || 0),
        },
        location: {
          ...propertyData.location,
          coordinates: {
            lat: 40.7128, // Default to NYC for demo
            lng: -74.006,
          },
        },
        images: imageUrls.map((url, index) => ({
          url,
          publicId: extractPublicId(url), // ✅ We'll define this function below
          isPrimary: index === 0, // First image is primary
        })),
      };

      console.log("🚀 Submitting property data:", propertyWithCoords);

      await propertyService.createProperty(propertyWithCoords);
      toast.success("Property created successfully!");
      navigate("/dashboard/properties");
    } catch (error) {
      console.error("❌ Error creating property:", error);
      toast.error(error.message || "Failed to create property");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: Home },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Details", icon: Users },
    { number: 4, title: "Photos", icon: Camera },
    { number: 5, title: "Pricing", icon: DollarSign },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={propertyData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Beautiful apartment in downtown"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 5 characters</p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={propertyData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your property in detail..."
                className="min-h-[120px]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters ({propertyData.description.length}/50)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Property Type</Label>
                <Select
                  value={propertyData.propertyType}
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
                  value={propertyData.roomType}
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={propertyData.location.address}
                onChange={(e) =>
                  handleLocationChange("address", e.target.value)
                }
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={propertyData.location.city}
                  onChange={(e) => handleLocationChange("city", e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={propertyData.location.state}
                  onChange={(e) =>
                    handleLocationChange("state", e.target.value)
                  }
                  placeholder="NY"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={propertyData.location.country}
                  onChange={(e) =>
                    handleLocationChange("country", e.target.value)
                  }
                  placeholder="United States"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={propertyData.location.zipCode}
                  onChange={(e) =>
                    handleLocationChange("zipCode", e.target.value)
                  }
                  placeholder="10001"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="accommodates">Guests</Label>
                <Input
                  id="accommodates"
                  type="number"
                  min="1"
                  value={propertyData.accommodates}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleInputChange("accommodates", Math.max(1, value));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={propertyData.bedrooms}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleInputChange("bedrooms", Math.max(0, value));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={propertyData.bathrooms}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0.5;
                    handleInputChange("bathrooms", Math.max(0.5, value));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="beds">Beds</Label>
                <Input
                  id="beds"
                  type="number"
                  min="1"
                  value={propertyData.beds}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleInputChange("beds", Math.max(1, value));
                  }}
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {AMENITIES.map((amenity) => (
                  <div
                    key={amenity.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={amenity.value}
                      checked={propertyData.amenities.includes(amenity.value)}
                      onCheckedChange={() => handleAmenityToggle(amenity.value)}
                    />
                    <Label
                      htmlFor={amenity.value}
                      className="text-sm cursor-pointer"
                    >
                      {amenity.icon} {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Property Photos</Label>
              <p className="text-sm text-gray-500 mb-4">
                Add high-quality photos of your property. The first photo will
                be the main image.
              </p>
              <ImageUpload
                images={propertyData.images}
                onImagesChange={handleImagesChange}
                maxImages={10}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="basePrice">Base Price (per night)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="basePrice"
                    type="number"
                    min="1"
                    value={propertyData.pricing.basePrice}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      handleInputChange(
                        "pricing.basePrice",
                        Math.max(1, value)
                      );
                    }}
                    className="pl-10"
                    placeholder="50"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum $1 per night
                </p>
              </div>
              <div>
                <Label htmlFor="cleaningFee">Cleaning Fee (optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="cleaningFee"
                    type="number"
                    min="0"
                    value={propertyData.pricing.cleaningFee}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      handleInputChange(
                        "pricing.cleaningFee",
                        Math.max(0, value)
                      );
                    }}
                    className="pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">House Rules</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smokingAllowed"
                    checked={propertyData.houseRules.smokingAllowed}
                    onCheckedChange={(checked) =>
                      setPropertyData((prev) => ({
                        ...prev,
                        houseRules: {
                          ...prev.houseRules,
                          smokingAllowed: checked,
                        },
                      }))
                    }
                  />
                  <Label htmlFor="smokingAllowed">Smoking allowed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="petsAllowed"
                    checked={propertyData.houseRules.petsAllowed}
                    onCheckedChange={(checked) =>
                      setPropertyData((prev) => ({
                        ...prev,
                        houseRules: {
                          ...prev.houseRules,
                          petsAllowed: checked,
                        },
                      }))
                    }
                  />
                  <Label htmlFor="petsAllowed">Pets allowed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="partiesAllowed"
                    checked={propertyData.houseRules.partiesAllowed}
                    onCheckedChange={(checked) =>
                      setPropertyData((prev) => ({
                        ...prev,
                        houseRules: {
                          ...prev.houseRules,
                          partiesAllowed: checked,
                        },
                      }))
                    }
                  />
                  <Label htmlFor="partiesAllowed">Parties/events allowed</Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/properties")}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${
                  isActive
                    ? "border-wanderlust-500 bg-wanderlust-500 text-white"
                    : isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 text-gray-500"
                }
              `}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <div
                  className={`text-sm font-medium ${
                    isActive ? "text-wanderlust-600" : "text-gray-500"
                  }`}
                >
                  Step {step.number}
                </div>
                <div className="text-xs text-gray-400">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-300 mx-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Progress */}
      {loading && uploadProgress > 0 && (
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

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex space-x-4">
          {currentStep < steps.length ? (
            <Button
              onClick={() =>
                setCurrentStep(Math.min(steps.length, currentStep + 1))
              }
              className="bg-wanderlust-600 hover:bg-wanderlust-700"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-wanderlust-600 hover:bg-wanderlust-700"
            >
              {loading ? "Creating Property..." : "Create Property"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
