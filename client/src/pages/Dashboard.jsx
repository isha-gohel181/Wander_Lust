// client/src/pages/Dashboard.jsx
import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  Building,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardOverview from "./dashboard/DashboardOverview";
import MyProperties from "./dashboard/MyProperties";
import HostBookings from "./dashboard/HostBooking";
import AddProperty from "./dashboard/AddProperty";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const location = useLocation();
  const { user, isHost, becomeHost } = useAuth();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: Home, exact: true },
    { name: "Properties", href: "/dashboard/properties", icon: Building },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in
          </h1>
          <p className="text-gray-600">
            You need to be signed in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!isHost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Building className="h-16 w-16 text-wanderlust-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Become a Host on Wanderlust
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Share your space and earn extra income by hosting travelers from
              around the world.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle className="text-lg">Easy Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    List your space in minutes with our simple setup process.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <BarChart3 className="h-8 w-8 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle className="text-lg">Smart Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our tools help you set competitive prices and maximize
                    earnings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <MessageSquare className="h-8 w-8 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle className="text-lg">24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get help whenever you need it from our support team.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={becomeHost}
              size="lg"
              className="bg-wanderlust-500 hover:bg-wanderlust-600 text-lg px-8 py-3"
            >
              Start Hosting Today
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-20">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Host Dashboard
                </h2>
                <Badge variant="secondary" className="ml-2">
                  Host
                </Badge>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                        ${
                          isActive(item.href, item.exact)
                            ? "bg-wanderlust-100 text-wanderlust-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <Icon
                        className={`
                          mr-3 flex-shrink-0 h-5 w-5
                          ${
                            isActive(item.href, item.exact)
                              ? "text-wanderlust-500"
                              : "text-gray-400 group-hover:text-gray-500"
                          }
                        `}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Add Property Button */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <Link to="/dashboard/properties/new">
                <Button className="w-full bg-wanderlust-500 hover:bg-wanderlust-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <div className="flex-1">
            <Routes>
              <Route path="" element={<DashboardOverview />} />
              <Route path="properties" element={<MyProperties />} />
              <Route path="properties/new" element={<AddProperty />} />
              <Route path="bookings" element={<HostBookings />} />
              <Route
                path="/messages"
                element={<div className="p-8">Messages - Coming Soon</div>}
              />
              <Route
                path="/analytics"
                element={<div className="p-8">Analytics - Coming Soon</div>}
              />
              <Route
                path="/settings"
                element={<div className="p-8">Settings - Coming Soon</div>}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
