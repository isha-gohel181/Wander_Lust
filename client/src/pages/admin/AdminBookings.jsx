import React, { useState } from "react";
import BookingCard from "@/components/booking/BookingCard";
import { useBookings } from "@/hooks/useBookings";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner"; // If you have a spinner component

const AdminBookings = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { bookings, loading, error, updateBookingStatus, refresh } =
    useBookings("admin", {
      enabled: true,
      queryParams: { search, status },
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600">
          Monitor and manage all bookings on the platform.
        </p>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by property or guest"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled_by_guest">Cancelled by Guest</option>
          <option value="cancelled_by_host">Cancelled by Host</option>
        </Select>
        <button onClick={refresh} className="btn btn-primary">
          Refresh
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid gap-6">
          {bookings.length === 0 ? (
            <div>No bookings found.</div>
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onStatusUpdate={updateBookingStatus}
                userRole="admin"
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
