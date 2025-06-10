// client/src/pages/Bookings.jsx
import React, { useState } from "react";
import { Calendar, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookingCard from "@/components/booking/BookingCard";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import { BOOKING_STATUS } from "@/utils/constants";

const Bookings = () => {
  const { user, isHost } = useAuth();
  const { bookings: guestBookings, updateBookingStatus: updateGuestBooking } =
    useBookings("guest");
  const { bookings: hostBookings, updateBookingStatus: updateHostBooking } =
    useBookings("host");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filterBookings = (bookings) => {
    return bookings.filter((booking) => {
      const matchesSearch =
        searchTerm === "" ||
        booking.property.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.property.location.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredGuestBookings = filterBookings(guestBookings);
  const filteredHostBookings = isHost ? filterBookings(hostBookings) : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in
          </h1>
          <p className="text-gray-600">
            You need to be signed in to view your bookings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Bookings
            </h1>
            <p className="text-gray-600">
              Manage your trips and hosting reservations
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by property name or location..."
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
          <Tabs defaultValue="guest" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
              <TabsTrigger value="guest" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Your Trips ({filteredGuestBookings.length})
              </TabsTrigger>
              {isHost && (
                <TabsTrigger value="host" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Your Reservations ({filteredHostBookings.length})
                </TabsTrigger>
              )}
            </TabsList>

            {/* Guest Bookings */}
            <TabsContent value="guest">
              <div className="space-y-6">
                {filteredGuestBookings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm || statusFilter !== "all"
                        ? "No bookings found"
                        : "No trips yet"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "When you're ready to explore, we'll show your trips here"}
                    </p>
                    {!searchTerm && statusFilter === "all" && (
                      <Button
                        onClick={() => (window.location.href = "/search")}
                        className="bg-wanderlust-500 hover:bg-wanderlust-600"
                      >
                        Start Searching
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredGuestBookings.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onStatusUpdate={updateGuestBooking}
                        userRole="guest"
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Host Bookings */}
            {isHost && (
              <TabsContent value="host">
                <div className="space-y-6">
                  {filteredHostBookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm || statusFilter !== "all"
                          ? "No reservations found"
                          : "No reservations yet"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "When guests book your properties, you'll see their reservations here"}
                      </p>
                      {!searchTerm && statusFilter === "all" && (
                        <Button
                          onClick={() =>
                            (window.location.href = "/dashboard/properties")
                          }
                          className="bg-wanderlust-500 hover:bg-wanderlust-600"
                        >
                          Manage Properties
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredHostBookings.map((booking) => (
                        <BookingCard
                          key={booking._id}
                          booking={booking}
                          onStatusUpdate={updateHostBooking}
                          userRole="host"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
