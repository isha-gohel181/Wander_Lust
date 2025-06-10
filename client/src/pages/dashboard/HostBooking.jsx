// client/src/pages/dashboard/HostBookings.jsx
import React, { useState } from "react";
import { Calendar, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCard from "@/components/booking/BookingCard";
import { useBookings } from "@/hooks/useBookings";
import { BOOKING_STATUS } from "@/utils/constants";

const HostBookings = () => {
  const { bookings, updateBookingStatus, loading } = useBookings("host");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filterBookings = (bookings, tab) => {
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
      filtered = filtered.filter(
        (booking) =>
          booking.property.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.guest.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.guest.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
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
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "When guests book your properties, you'll see their reservations here"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tabBookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onStatusUpdate={updateBookingStatus}
            userRole="host"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Reservations</h1>
        <p className="text-gray-600">
          Manage guest bookings for your properties
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by property or guest name..."
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
