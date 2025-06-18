import React, { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardOverview from "./dashboard/DashboardOverview";
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
    { name: "Overview", href: "/dashboard", icon: Home, exact: true },
    { name: "Properties", href: "/dashboard/properties", icon: Building },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // Mobile Navigation Item Component
  const NavItem = ({ item, mobile = false }) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.name}
        to={item.href}
        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
          ${
            isActive(item.href, item.exact)
              ? "bg-wanderlust-100 text-wanderlust-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        <Icon
          className={`mr-3 flex-shrink-0 h-5 w-5
            ${
              isActive(item.href, item.exact)
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
            <Building className="h-12 w-12 sm:h-16 sm:w-16 text-wanderlust-500 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Become a Host on Wanderlust
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Share your space and earn extra income by hosting travelers from
              around the world.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card>
                <CardHeader className="text-center py-4 sm:py-6">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle className="text-base sm:text-lg">
                    Easy Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm sm:text-base">
                  <p className="text-gray-600">
                    List your space in minutes with our simple setup process.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center py-4 sm:py-6">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle className="text-base sm:text-lg">
                    Smart Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm sm:text-base">
                  <p className="text-gray-600">
                    Our tools help you set competitive prices and maximize
                    earnings.
                  </p>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 md:col-span-1">
                <CardHeader className="text-center py-4 sm:py-6">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-wanderlust-500 mx-auto mb-2" />
                  <CardTitle className="text-base sm:text-lg">
                    24/7 Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm sm:text-base">
                  <p className="text-gray-600">
                    Get help whenever you need it from our support team.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={becomeHost}
              size="lg"
              className="bg-wanderlust-500 hover:bg-wanderlust-600 w-full sm:w-auto text-base sm:text-lg px-4 sm:px-8 py-2.5 sm:py-3"
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
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Host Dashboard
          </h2>
          <Badge variant="secondary" className="ml-2">
            Host
          </Badge>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Host Dashboard
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} mobile={true} />
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <Link
                  to="/dashboard/properties/new"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-wanderlust-500 hover:bg-wanderlust-600 text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
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
              <nav className="mt-5 flex-1 px-2 space-y-1 ">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
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
              <Route path="messages" element={<DashboardMessages />} />
              <Route
                path="analytics"
                element={
                  <div className="p-4 sm:p-8">Analytics - Coming Soon</div>
                }
              />
              <Route
                path="settings"
                element={
                  <div className="p-4 sm:p-8">Settings - Coming Soon</div>
                }
              />
            </Routes>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-40">
        {navigation.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
                isActive(item.href, item.exact)
                  ? "text-wanderlust-700"
                  : "text-gray-600"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 mb-1 ${
                    isActive(item.href, item.exact)
                      ? "text-wanderlust-500"
                      : "text-gray-500"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-wanderlust-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
        <Link
          to="/dashboard/properties/new"
          className="flex flex-col items-center justify-center px-2 py-1 text-xs text-wanderlust-700"
        >
          <Plus className="h-5 w-5 mb-1 text-wanderlust-500" />
          <span>Add</span>
        </Link>
      </div>

      {/* Padding for mobile bottom nav */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
};

export default Dashboard;
