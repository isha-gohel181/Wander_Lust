import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  MapPin,
  IndianRupee,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { propertyService } from "@/services/properties";
import { uploadService } from "@/services/upload";
import { PROPERTY_TYPES, ROOM_TYPES, AMENITIES } from "@/utils/constants";
import { extractPublicId } from "@/utils/helpers";
import ImageUpload from "@/components/property/ImageUpload";
import {
  nominatimGeocode,
  nominatimReverseGeocode,
  formatAddress,
  DEFAULT_LOCATION,
  DEFAULT_ADDRESS,
} from "@/utils/geocoding";
import LeafletMap from "@/components/map/LeafletMap";
import MapError from "@/components/map/MapError";
import toast from "react-hot-toast";

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mapError, setMapError] = useState(null);
  const [geocodingInProgress, setGeocodingInProgress] = useState(false);
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
      coordinates: DEFAULT_LOCATION,
    },
    pricing: {
      basePrice: 3500,
      cleaningFee: 0,
      serviceFee: 0,
      currency: "INR",
    },
    amenities: [],
    images: [],
    houseRules: {
      checkInTime: "15:00",
      checkOutTime: "11:00",
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      maxGuests: 1,
    },
  });

  const handleInputChange = useCallback((field, value) => {
    setPropertyData((prev) => {
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
  }, []);

  // Update geocoding functions
  const handleLocationChange = useCallback(
    async (field, value) => {
      setPropertyData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));

      if (
        field === "address" ||
        field === "city" ||
        field === "state" ||
        field === "country"
      ) {
        const updatedLocation = {
          ...propertyData.location,
          [field]: value,
        };

        if (
          updatedLocation.address &&
          updatedLocation.city &&
          updatedLocation.state
        ) {
          setGeocodingInProgress(true);
          try {
            const fullAddress = formatAddress(updatedLocation);
            const result = await nominatimGeocode(fullAddress);

            setPropertyData((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                coordinates: {
                  lat: result.lat,
                  lng: result.lng,
                },
              },
            }));
            setMapError(null);
          } catch (error) {
            setMapError("Unable to find location on map");
            console.error("Geocoding error:", error);
          } finally {
            setGeocodingInProgress(false);
          }
        }
      }
    },
    [propertyData.location]
  );

  const handleMarkerDragEnd = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    try {
      setGeocodingInProgress(true);
      const result = await nominatimReverseGeocode({ lat, lng });

      setPropertyData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: result.street,
          city: result.city,
          state: result.state,
          country: result.country,
          zipCode: result.zipCode,
          coordinates: { lat, lng },
        },
      }));
      setMapError(null);
    } catch (error) {
      setMapError("Unable to find address for this location");
      console.error("Reverse geocoding error:", error);
    } finally {
      setGeocodingInProgress(false);
    }
  }, []);

  const handleAmenityToggle = useCallback((amenity) => {
    setPropertyData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);

  const handleImagesChange = useCallback((images) => {
    setPropertyData((prev) => ({
      ...prev,
      images,
    }));
  }, []);

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!propertyData.title || propertyData.title.length < 5) {
          toast.error("Title must be at least 5 characters long");
          return false;
        }
        if (!propertyData.description || propertyData.description.length < 50) {
          toast.error("Description must be at least 50 characters");
          return false;
        }
        if (!propertyData.propertyType || !propertyData.roomType) {
          toast.error("Please select property and room type");
          return false;
        }
        break;

      case 2:
        if (
          !propertyData.location.address ||
          !propertyData.location.city ||
          !propertyData.location.state ||
          !propertyData.location.country ||
          !propertyData.location.zipCode
        ) {
          toast.error("Please fill in all location fields");
          return false;
        }
        break;

      case 3:
        if (
          propertyData.accommodates < 1 ||
          propertyData.bedrooms < 0 ||
          propertyData.bathrooms < 0.5 ||
          propertyData.beds < 1
        ) {
          toast.error("Please enter valid numbers for accommodation details");
          return false;
        }
        break;

      case 4:
        if (!propertyData.images.length) {
          toast.error("Please add at least one image");
          return false;
        }
        break;

      case 5:
        if (propertyData.pricing.basePrice < 1) {
          toast.error("Base price must be at least ₹3500");
          return false;
        }
        break;
    }
    return true;
  };

  const uploadImages = async (images) => {
    if (!images || images.length === 0) return [];

    try {
      const imagesToUpload = images.filter((img) => img.file && !img.uploaded);

      if (imagesToUpload.length === 0) {
        return images.filter((img) => img.uploaded).map((img) => img.url);
      }

      const compressedImages = await Promise.all(
        imagesToUpload.map(async (img) => {
          if (img.file.size > 1024 * 1024) {
            return await uploadService.compressImage(img.file);
          }
          return img.file;
        })
      );

      const uploadResponse = await uploadService.uploadImagesWithProgress(
        compressedImages,
        "properties",
        setUploadProgress
      );

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
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      toast.loading("Creating your property listing...");

      const imageUrls = await uploadImages(propertyData.images);

      const propertyPayload = {
        ...propertyData,
        accommodates: Number(propertyData.accommodates),
        bedrooms: Number(propertyData.bedrooms),
        bathrooms: Number(propertyData.bathrooms),
        beds: Number(propertyData.beds),
        pricing: {
          ...propertyData.pricing,
          basePrice: Number(propertyData.pricing.basePrice),
          cleaningFee: Number(propertyData.pricing.cleaningFee || 0),
          serviceFee: Number(propertyData.pricing.serviceFee || 0),
        },
        images: imageUrls.map((url, index) => ({
          url,
          publicId: extractPublicId(url),
          isPrimary: index === 0,
        })),
      };

      await propertyService.createProperty(propertyPayload);
      toast.success("Property created successfully!");
      navigate("/dashboard/properties");
    } catch (error) {
      console.error("Error creating property:", error);
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
    { number: 5, title: "Pricing", icon: IndianRupee },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Property Title
              </Label>
              <Input
                id="title"
                value={propertyData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Beautiful apartment in downtown"
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 5 characters</p>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={propertyData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your property in detail..."
                className="min-h-[120px] mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters ({propertyData.description.length}/50)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Property Type</Label>
                <Select
                  value={propertyData.propertyType}
                  onValueChange={(value) =>
                    handleInputChange("propertyType", value)
                  }
                >
                  <SelectTrigger className="mt-1">
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
                <Label className="text-sm font-medium">Room Type</Label>
                <Select
                  value={propertyData.roomType}
                  onValueChange={(value) =>
                    handleInputChange("roomType", value)
                  }
                >
                  <SelectTrigger className="mt-1">
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
              <Label htmlFor="address" className="text-sm font-medium">
                Street Address
              </Label>
              <Input
                id="address"
                value={propertyData.location.address}
                onChange={(e) =>
                  handleLocationChange("address", e.target.value)
                }
                placeholder="123 Main Street"
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={propertyData.location.city}
                  onChange={(e) => handleLocationChange("city", e.target.value)}
                  placeholder="New York"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium">
                  State/Province
                </Label>
                <Input
                  id="state"
                  value={propertyData.location.state}
                  onChange={(e) =>
                    handleLocationChange("state", e.target.value)
                  }
                  placeholder="NY"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <Input
                  id="country"
                  value={propertyData.location.country}
                  onChange={(e) =>
                    handleLocationChange("country", e.target.value)
                  }
                  placeholder="United States"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-sm font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  value={propertyData.location.zipCode}
                  onChange={(e) =>
                    handleLocationChange("zipCode", e.target.value)
                  }
                  placeholder="10001"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Pin Location on Map</Label>
              <div className="h-[250px] sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden mt-2 relative">
                <LeafletMap
                  center={propertyData.location.coordinates}
                  markerPosition={propertyData.location.coordinates}
                  onMarkerDragEnd={handleMarkerDragEnd}
                  draggable={true}
                  zoom={13}
                />
                {geocodingInProgress && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-sm">
                      Updating location...
                    </div>
                  </div>
                )}
              </div>
              {mapError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription className="text-sm">
                    {mapError}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="accommodates" className="text-sm font-medium">
                  Guests
                </Label>
                <Input
                  id="accommodates"
                  type="number"
                  min="1"
                  value={propertyData.accommodates}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleInputChange("accommodates", Math.max(1, value));
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bedrooms" className="text-sm font-medium">
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={propertyData.bedrooms}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleInputChange("bedrooms", Math.max(0, value));
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms" className="text-sm font-medium">
                  Bathrooms
                </Label>
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
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="beds" className="text-sm font-medium">
                  Beds
                </Label>
                <Input
                  id="beds"
                  type="number"
                  min="1"
                  value={propertyData.beds}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleInputChange("beds", Math.max(1, value));
                  }}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Amenities</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                {AMENITIES.map((amenity) => (
                  <div
                    key={amenity.value}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox
                      id={amenity.value}
                      checked={propertyData.amenities.includes(amenity.value)}
                      onCheckedChange={() => handleAmenityToggle(amenity.value)}
                    />
                    <Label
                      htmlFor={amenity.value}
                      className="text-sm cursor-pointer flex items-center space-x-1"
                    >
                      <span>{amenity.icon}</span>
                      <span>{amenity.label}</span>
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
              <p className="text-sm text-gray-500 mb-4 mt-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="basePrice" className="text-sm font-medium">
                  Base Price (per night)
                </Label>
                <div className="relative mt-1">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                    placeholder="3500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum ₹1500 per night
                </p>
              </div>

              <div>
                <Label htmlFor="cleaningFee" className="text-sm font-medium">
                  Cleaning Fee (optional)
                </Label>
                <div className="relative mt-1">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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

              <div>
                <Label htmlFor="serviceFee" className="text-sm font-medium">
                  Service Fee (optional)
                </Label>
                <div className="relative mt-1">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="serviceFee"
                    type="number"
                    min="0"
                    value={propertyData.pricing.serviceFee}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      handleInputChange(
                        "pricing.serviceFee",
                        Math.max(0, value)
                      );
                    }}
                    className="pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Summary card showing total price */}
            <Card className="mt-4 bg-gray-50">
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Base Price:</span>
                    <span className="font-medium text-sm">
                      ₹{propertyData.pricing.basePrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Cleaning Fee:</span>
                    <span className="font-medium text-sm">
                      ₹{propertyData.pricing.cleaningFee}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Service Fee:</span>
                    <span className="font-medium text-sm">
                      ₹{propertyData.pricing.serviceFee}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between items-center">
                    <span className="font-semibold text-sm">
                      Total Price per Night:
                    </span>
                    <span className="font-semibold text-sm">
                      ₹
                      {propertyData.pricing.basePrice +
                        propertyData.pricing.cleaningFee +
                        propertyData.pricing.serviceFee}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                House Rules
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smokingAllowed"
                    checked={propertyData.houseRules.smokingAllowed}
                    onCheckedChange={(checked) =>
                      handleInputChange("houseRules.smokingAllowed", checked)
                    }
                  />
                  <Label htmlFor="smokingAllowed" className="text-sm">
                    Smoking allowed
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="petsAllowed"
                    checked={propertyData.houseRules.petsAllowed}
                    onCheckedChange={(checked) =>
                      handleInputChange("houseRules.petsAllowed", checked)
                    }
                  />
                  <Label htmlFor="petsAllowed" className="text-sm">
                    Pets allowed
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="partiesAllowed"
                    checked={propertyData.houseRules.partiesAllowed}
                    onCheckedChange={(checked) =>
                      handleInputChange("houseRules.partiesAllowed", checked)
                    }
                  />
                  <Label htmlFor="partiesAllowed" className="text-sm">
                    Parties/events allowed
                  </Label>
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/properties")}
            className="flex items-center text-sm sm:text-base p-2 sm:p-3"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Properties</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Add New Property
          </h1>
        </div>

        {/* Mobile Progress Steps */}
        <div className="block sm:hidden mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {steps[currentStep - 1]?.title}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-wanderlust-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop Progress Steps */}
        <div className="hidden sm:flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;

            return (
              <div key={step.number} className="flex items-center min-w-0">
                <div
                  className={`
                  flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 transition-colors flex-shrink-0
                  ${
                    isActive
                      ? "border-wanderlust-500 bg-wanderlust-500 text-white"
                      : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 text-gray-500"
                  }
                `}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="ml-2 sm:ml-3 min-w-0">
                  <div
                    className={`text-xs sm:text-sm font-medium ${
                      isActive ? "text-wanderlust-600" : "text-gray-500"
                    }`}
                  >
                    Step {step.number}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-gray-300 mx-2 sm:mx-4 min-w-[20px]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Upload Progress */}
        {loading && uploadProgress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
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
        <Card className="shadow-sm">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-lg sm:text-xl">
              {steps[currentStep - 1]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="w-full sm:w-auto order-2 sm:order-1"
            size="sm"
          >
            Previous
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-wanderlust-600 hover:bg-wanderlust-700 w-full sm:w-auto order-1 sm:order-2"
            size="sm"
          >
            {currentStep < steps.length
              ? "Next"
              : loading
              ? "Creating..."
              : "Create Property"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
