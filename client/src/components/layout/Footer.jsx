// client/src/components/layout/Footer.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const location = useLocation();

  // Check if we're on a dashboard page (has sidebar)
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
          isDashboardPage ? "lg:pl-64" : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-wanderlust-500 to-wanderlust-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Wanderlust
              </span>
            </div>
            <p className="text-gray-600">
              Discover unique places to stay and experiences around the world.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-wanderlust-500 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-wanderlust-500 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-wanderlust-500 cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-wanderlust-500 cursor-pointer" />
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Safety Information
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/refer"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Refer Friends
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hosting</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/become-host"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Become a Host
                </Link>
              </li>
              <li>
                <Link
                  to="/host-resources"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Host Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/host-community"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Host Community
                </Link>
              </li>
              <li>
                <Link
                  to="/responsible-hosting"
                  className="text-gray-600 hover:text-wanderlust-500"
                >
                  Responsible Hosting
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
            <span className="text-sm text-gray-600">
              © 2024 Wanderlust. All rights reserved.
            </span>
            <Link
              to="/privacy"
              className="text-sm text-gray-600 hover:text-wanderlust-500"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-600 hover:text-wanderlust-500"
            >
              Terms of Service
            </Link>
            <Link
              to="/sitemap"
              className="text-sm text-gray-600 hover:text-wanderlust-500"
            >
              Sitemap
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">🌍 English (IN)</span>
            <span className="text-sm text-gray-600">₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
