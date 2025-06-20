import React, { useState } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MyProperties from "./dashboard/MyProperties";
import HostBookings from "./dashboard/HostBooking";
import AddProperty from "./dashboard/AddProperty";
import DashboardMessages from "./dashboard/DashboardMessages";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";

const Dashboard = () => {
  const location = useLocation();
  const { user, isHost, becomeHost } = useAuth();
  const { unreadCount } = useMessages();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    // Overview removed
    { name: "Properties", href: "/dashboard/properties", icon: Building },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    // { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (href) => location.pathname.startsWith(href);

  const NavItem = ({ item, mobile = false }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.href}
        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
        ${
          isActive(item.href)
            ? "bg-wanderlust-100 text-wanderlust-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        <Icon
          className={`mr-3 h-5 w-5 ${
            isActive(item.href)
              ? "text-wanderlust-500"
              : "text-gray-400 group-hover:text-gray-500"
          }`}
        />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <Badge className="bg-wanderlust-500 text-white">{item.badge}</Badge>
        )}
      </Link>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Building className="h-12 w-12 text-wanderlust-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-gray-900">
              Become a Host on Wanderlust
            </h1>
            <p className="text-gray-600 mb-6">
              Share your space and earn extra income by hosting travelers from
              around the world.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="text-center py-4">
                  <Users className="h-6 w-6 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle>Easy Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    List your space in minutes with our simple setup process.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center py-4">
                  <BarChart3 className="h-6 w-6 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle>Smart Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Our tools help you set competitive prices and maximize
                    earnings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center py-4">
                  <MessageSquare className="h-6 w-6 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle>24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Get help whenever you need it from our support team.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={becomeHost}
              className="bg-wanderlust-500 hover:bg-wanderlust-600"
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
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex items-center justify-between px-8 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Host Dashboard
              </h2>
              <Badge variant="secondary">Host</Badge>
            </div>
            <nav className="flex-1 px-2 py-12 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
            <div className="p-4 border-t">
              <Link to="/dashboard/properties/new">
                <Button className="w-full bg-wanderlust-500 hover:bg-wanderlust-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          <Routes>
            <Route index element={<Navigate to="properties" replace />} />
            <Route path="properties" element={<MyProperties />} />
            <Route path="properties/new" element={<AddProperty />} />
            <Route path="bookings" element={<HostBookings />} />
            <Route path="messages" element={<DashboardMessages />} />
            <Route
              path="analytics"
              element={<div className="p-4">Analytics - Coming Soon</div>}
            />
            {/* <Route
              path="settings"
              element={<div className="p-4">Settings - Coming Soon</div>}
            /> */}
          </Routes>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-40">
        {navigation.slice(0, 3).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center text-xs ${
                isActive(item.href) ? "text-wanderlust-700" : "text-gray-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        <Link
          to="/dashboard/properties/new"
          className="flex flex-col items-center justify-center text-xs text-wanderlust-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
