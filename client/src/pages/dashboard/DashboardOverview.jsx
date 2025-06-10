// client/src/pages/dashboard/DashboardOverview.jsx
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Users,
  Building,
  TrendingUp,
  Star,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 12750,
    thisMonthEarnings: 2340,
    totalBookings: 45,
    activeListings: 3,
    averageRating: 4.8,
    responseRate: 100,
    viewsThisMonth: 324,
    messagesUnread: 2,
  });

  const recentBookings = [
    {
      id: 1,
      guest: "Sarah Johnson",
      property: "Cozy Downtown Apartment",
      checkIn: "2024-06-15",
      checkOut: "2024-06-18",
      total: 450,
      status: "confirmed",
    },
    {
      id: 2,
      guest: "Mike Chen",
      property: "Modern Studio Loft",
      checkIn: "2024-06-20",
      checkOut: "2024-06-23",
      total: 675,
      status: "pending",
    },
    {
      id: 3,
      guest: "Emma Davis",
      property: "Seaside Villa",
      checkIn: "2024-06-25",
      checkOut: "2024-06-30",
      total: 1200,
      status: "confirmed",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your properties
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatPrice(stats.thisMonthEarnings)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
            <p className="text-xs text-muted-foreground">Properties listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Based on all reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Views This Month
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Property page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              Message response rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unread Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesUnread}</div>
            <p className="text-xs text-muted-foreground">Require response</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {booking.guest}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {booking.property}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.checkIn} - {booking.checkOut}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice(booking.total)}
                    </div>
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
