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
  MessageSquare,
  Target,
  FileText,
  BookOpen,
  Bot,
  BarChart3,
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile menu
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // app menu
  const [clerkMenuOpen, setClerkMenuOpen] = useState(false); // clerk menu
  const { user } = useUser();
  const navigate = useNavigate();
  const { unreadCount } = useMessages();

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
                    className="relative h-8 w-8"
                    aria-label="Open app menu"
                    onClick={() => {
                      if (profileMenuOpen) setProfileMenuOpen(false);
                      else openProfileMenu();
                    }}
                  >
                    <Menu className="h-4 w-4"/>
                    {/* <img
                      src={user?.imageUrl}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    /> */}
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
                  
                  <DropdownMenuSeparator />
                  
                  {/* Career Tools Section */}
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/career-dashboard");
                      closeMenus();
                    }}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Career Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/assessment");
                      closeMenus();
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Take Assessment</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/resume-analyzer");
                      closeMenus();
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Resume Analyzer</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/career-path");
                      closeMenus();
                    }}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    <span>Career Paths</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/chat");
                      closeMenus();
                    }}
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    <span>Career Chat</span>
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
              className="p-2"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
