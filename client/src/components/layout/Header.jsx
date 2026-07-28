//client/src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  MessageSquare,
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
import { useMessages } from "@/hooks/useMessages";
import BrandLogo from "./BrandLogo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile menu
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // app menu
  const [clerkMenuOpen, setClerkMenuOpen] = useState(false); // clerk menu
  const [isScrolled, setIsScrolled] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useMessages();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHome && !isScrolled && !isMenuOpen && !isSearchOpen;

  // Ensure only one menu is open at a time (desktop)
  const openProfileMenu = () => {
    setProfileMenuOpen(true);
    setClerkMenuOpen(false);
  };
  const openClerkMenu = () => {
    setClerkMenuOpen(true);
    setProfileMenuOpen(false);
  };
  const closeMenus = () => {
    setProfileMenuOpen(false);
    setClerkMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Wanderlust home">
            <BrandLogo size="sm" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium transition-colors duration-200 text-gray-900">
            <Link to="/" className="font-semibold transition-colors text-gray-900 hover:text-wanderlust-500">
              Home
            </Link>
            <Link to="/search" className="transition-colors text-gray-900 hover:text-wanderlust-500">
              Blog
            </Link>
            <Link to="/search?category=all" className="transition-colors text-gray-900 hover:text-wanderlust-500">
              About Us
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center space-x-1 transition-colors cursor-pointer outline-none text-gray-900 hover:text-wanderlust-500`}
                >
                  <span>More</span>
                  <span className="text-xs">▾</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48 z-50">
                <DropdownMenuItem onClick={() => navigate("/search")}>
                  Destinations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                  Wishlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/bookings")}>
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  Become a Host
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop Navigation Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="font-medium transition-colors text-gray-900 hover:text-gray-900">
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="bg-wanderlust-500 hover:bg-wanderlust-600 text-white font-medium rounded-full px-6 py-2 transition-all shadow-sm"
                >
                  Sign Up
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="font-medium transition-colors text-gray-900">
                  Become a Host
                </Button>
              </Link>

              {/* App Profile Menu */}
              <DropdownMenu
                open={profileMenuOpen}
                onOpenChange={(open) => {
                  if (open) openProfileMenu();
                  else setProfileMenuOpen(false);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative h-8 w-8 transition-colors text-gray-900`}
                    aria-label="Open app menu"
                    onClick={() => {
                      if (profileMenuOpen) setProfileMenuOpen(false);
                      else openProfileMenu();
                    }}
                  >
                    <Menu className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-wanderlust-500 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[9999]">
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/profile");
                      closeMenus();
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/messages");
                      closeMenus();
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <Badge className="ml-auto bg-wanderlust-500 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/bookings");
                      closeMenus();
                    }}
                  >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/wishlist");
                      closeMenus();
                    }}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      closeMenus();
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Host Dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clerk UserButton, separate */}
              <div>
                <UserButton
                  userProfileMode="modal"
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonTrigger: "flex items-center justify-center p-0",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 transition-colors text-gray-900`}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 relative transition-colors text-gray-900`}
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
          <div className="lg:hidden py-4 h-4 border-gray-200">
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
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    size="sm"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link to="/messages" onClick={() => setIsMenuOpen(false)}>
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
                <Link to="/bookings" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    size="sm"
                  >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    My Bookings
                  </Button>
                </Link>
                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    size="sm"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                </Link>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
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
