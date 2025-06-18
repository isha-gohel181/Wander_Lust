//client/src/components/layout/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import {
  Search,
  Menu,
  X,
  Heart,
  User,
  Settings,
  Home as HomeIcon,
  MessageSquare, // Add MessageSquare icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import SearchBar from "../search/SearchBar";
import { useMessages } from "@/hooks/useMessages"; // Import useMessages hook

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const { unreadCount } = useMessages(); // Get unread message count

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-wanderlust-500 to-wanderlust-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900">
              Wanderlust
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="bg-wanderlust-500 hover:bg-wanderlust-600"
                >
                  Sign Up
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Become a Host
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Menu className="h-4 w-4 mr-2" />
                    <img
                      src={user?.imageUrl}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-wanderlust-500 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/messages")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <Badge className="ml-auto bg-wanderlust-500 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/bookings")}>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Host Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-full",
                          userButtonTrigger: "w-full justify-start",
                        },
                      }}
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSearch}
              className="p-2"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 relative"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <>
                  <Menu className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-wanderlust-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="justify-start" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button
                    className="bg-wanderlust-500 hover:bg-wanderlust-600"
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link to="/profile" onClick={toggleMenu}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    size="sm"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link to="/messages" onClick={toggleMenu}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    size="sm"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                    {unreadCount > 0 && (
                      <Badge className="ml-auto bg-wanderlust-500 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/bookings" onClick={toggleMenu}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    size="sm"
                  >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    My Bookings
                  </Button>
                </Link>
                <Link to="/wishlist" onClick={toggleMenu}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    size="sm"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                </Link>
                <Link to="/dashboard" onClick={toggleMenu}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    size="sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Host Dashboard
                  </Button>
                </Link>
                <div className="pt-2 border-t border-gray-200">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonTrigger:
                          "flex items-center justify-start w-full p-2",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
