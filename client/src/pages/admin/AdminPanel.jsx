import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import AdminUsers from "./AdminUsers";
import AdminProperties from "./AdminProperties";
import AdminBookings from "./AdminBookings";
import AdminReviews from "./AdminReviews";
import AdminAnalytics from "./AdminAnalytics";

const AdminPanel = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPanel;
