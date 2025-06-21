// client/src/pages/dashboard/HostBooking.jsx
import React, { useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  AlertCircle,
  RefreshCcw,
  Users,
  MapPin,
  Clock,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookings } from "@/hooks/useBookings";
import { BOOKING_STATUS } from "@/utils/constants";
import {
  formatPrice,
  formatDateRange,
  formatTimeAgo,
  formatDate,
} from "@/utils/helpers";
import toast from "react-hot-toast";

const BookingCard = ({ booking, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const status = BOOKING_STATUS[booking.status] || BOOKING_STATUS.pending;
  const canConfirm = booking.status === "pending";
  const canCancel = ["pending", "confirmed"].includes(booking.status);

  const handleStatusUpdate = async (newStatus) => {
    if (updating) return;

    setUpdating(true);
    try {
      await onStatusUpdate(booking._id, newStatus);
      toast.success(
        `Booking ${
          newStatus === "confirmed" ? "confirmed" : "cancelled"
        } successfully`
      );
    } catch (error) {
      toast.error("Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  // Calculate total guests safely
  const guests = booking.guests || { adults: 0, children: 0, infants: 0 };
  const totalGuests = guests.adults + guests.children + guests.infants;

  // Safe property and guest access
  const property = booking.property || {};
  const guest = booking.user || booking.guest || {};
  const location = property.location || {};

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {property.title || "Property name not available"}
            </h3>
            {(location.city || location.state) && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {location.city}
                  {location.city && location.state && ", "}
                  {location.state}
                </span>
              </div>
            )}
          </div>
          <Badge
            variant="secondary"
            className={`
              ${status.color === "green" && "bg-green-100 text-green-800"}
              ${status.color === "yellow" && "bg-yellow-100 text-yellow-800"}
              ${status.color === "red" && "bg-red-100 text-red-800"}
              ${status.color === "blue" && "bg-blue-100 text-blue-800"}
              ${status.color === "gray" && "bg-gray-100 text-gray-800"}
            `}
          >
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Property Image */}
        {property.images && property.images[0]?.url && (
          <div className="aspect-[16/9] rounded-lg overflow-hidden">
            <img
              src={property.images[0].url}
              alt={property.title || "Property"}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="w-full h-full bg-gray-200 rounded-lg hidden items-center justify-center">
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          </div>
        )}

        {/* Booking Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {booking.checkIn && booking.checkOut
                ? formatDateRange(booking.checkIn, booking.checkOut)
                : "Dates not available"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {totalGuests > 0
                ? `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`
                : "No guest info"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            {/* <IndianRupee className="h-4 w-4 mr-2 flex-shrink-0" /> */}
            <span>
              {booking.totalAmount || booking.pricing?.total
                ? formatPrice(
                    booking.totalAmount || booking.pricing.total,
                    "INR"
                  )
                : "Amount not available"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {booking.createdAt
                ? formatTimeAgo(booking.createdAt)
                : "Date not available"}
            </span>
          </div>
        </div>

        {/* Guest Information */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-wanderlust-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-wanderlust-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {guest.name ||
                guest.firstName ||
                guest.email ||
                "Guest information not available"}
            </div>
            <div className="text-sm text-gray-600">
              {guest.email || "Email not available"}
            </div>
          </div>
        </div>

        {/* Guest Breakdown */}
        {totalGuests > 0 && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <div className="font-medium mb-1">Guest Details:</div>
            <div className="flex gap-4">
              {guests.adults > 0 && <span>Adults: {guests.adults}</span>}
              {guests.children > 0 && <span>Children: {guests.children}</span>}
              {guests.infants > 0 && <span>Infants: {guests.infants}</span>}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {booking.specialRequests && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Contact Information */}
        {guest.phone && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Contact:</span> {guest.phone}
          </div>
        )}

        {/* Action Buttons */}
        {(canConfirm || canCancel) && (
          <div className="flex space-x-2 pt-2">
            {canConfirm && (
              <Button
                onClick={() => handleStatusUpdate("confirmed")}
                disabled={updating}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {updating ? "Updating..." : "Confirm Booking"}
              </Button>
            )}
            {canCancel && (
              <Button
                onClick={() => handleStatusUpdate("cancelled_by_host")}
                disabled={updating}
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                size="sm"
              >
                {updating ? "Updating..." : "Cancel"}
              </Button>
            )}
          </div>
        )}

        {/* Booking ID for reference */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Booking ID: {booking._id || "Not available"}
        </div>
      </CardContent>
    </Card>
  );
};

const HostBookings = () => {
  const { bookings, updateBookingStatus, loading, error, refresh } =
    useBookings("host");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filterBookings = (bookings, tab) => {
    if (!Array.isArray(bookings)) return [];

    let filtered = bookings;

    // Filter by tab
    if (tab === "pending") {
      filtered = filtered.filter((booking) => booking.status === "pending");
    } else if (tab === "confirmed") {
      filtered = filtered.filter((booking) => booking.status === "confirmed");
    } else if (tab === "completed") {
      filtered = filtered.filter((booking) => booking.status === "completed");
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((booking) => {
        const searchText = [
          booking?.property?.title || "",
          booking?.property?.location?.city || "",
          booking?.property?.location?.state || "",
          booking?.user?.name || "",
          booking?.user?.firstName || "",
          booking?.user?.lastName || "",
          booking?.user?.email || "",
          booking?.guest?.name || "",
          booking?.guest?.firstName || "",
          booking?.guest?.lastName || "",
          booking?.guest?.email || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchText.includes(searchTerm.toLowerCase());
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    return filtered;
  };

  const allBookings = filterBookings(bookings, "all");
  const pendingBookings = filterBookings(bookings, "pending");
  const confirmedBookings = filterBookings(bookings, "confirmed");
  const completedBookings = filterBookings(bookings, "completed");

  const getTabContent = (tabBookings, emptyMessage) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
            >
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-32 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (tabBookings.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No bookings found"
              : emptyMessage}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "When guests book your properties, you'll see their reservations here"}
          </p>
          {searchTerm || statusFilter !== "all" ? (
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tabBookings.map((booking) => (
          <BookingCard
            key={booking._id || Math.random()}
            booking={booking}
            onStatusUpdate={updateBookingStatus}
          />
        ))}
      </div>
    );
  };

  // Error State
  if (error && !loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Your Reservations
          </h1>
          <p className="text-gray-600">
            Manage guest bookings for your properties
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load bookings: {error}
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Your Reservations
          </h1>
          <p className="text-gray-600">
            Manage guest bookings for your properties
          </p>
        </div>
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by property, guest name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(BOOKING_STATUS).map(([status, config]) => (
                <SelectItem key={status} value={status}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="all">All ({allBookings.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({confirmedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {getTabContent(allBookings, "No reservations yet")}
        </TabsContent>

        <TabsContent value="pending">
          {getTabContent(pendingBookings, "No pending reservations")}
        </TabsContent>

        <TabsContent value="confirmed">
          {getTabContent(confirmedBookings, "No confirmed reservations")}
        </TabsContent>

        <TabsContent value="completed">
          {getTabContent(completedBookings, "No completed reservations")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HostBookings;
