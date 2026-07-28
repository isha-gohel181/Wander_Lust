// client/src/components/layout/Footer.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import BrandLogo from "./BrandLogo";

const Footer = () => {
  const location = useLocation();
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
            <BrandLogo showTagline />
            <p className="text-gray-600">
              Discover unique places to stay and experiences around the world.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <Icon
                  key={idx}
                  className="h-5 w-5 text-gray-400 hover:text-wanderlust-500 cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {[
            {
              title: "Support",
              links: [
                { to: "/help", label: "Help Center" },
                { to: "/safety", label: "Safety Information" },
                { to: "/cancellation", label: "Cancellation Options" },
                { to: "/contact", label: "Contact Us" },
              ],
            },
            {
              title: "Community",
              links: [
                { to: "/blog", label: "Blog" },
                { to: "/events", label: "Events" },
                { to: "/refer", label: "Refer Friends" },
                { to: "/careers", label: "Careers" },
              ],
            },
            {
              title: "Hosting",
              links: [
                { to: "/become-host", label: "Become a Host" },
                { to: "/host-resources", label: "Host Resources" },
                { to: "/host-community", label: "Host Community" },
                { to: "/responsible-hosting", label: "Responsible Hosting" },
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-gray-600 hover:text-wanderlust-500"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
            <span className="text-sm text-gray-600">
              © 2024 Wanderlust. All rights reserved.
            </span>
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms", label: "Terms of Service" },
              { to: "/sitemap", label: "Sitemap" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-gray-600 hover:text-wanderlust-500"
              >
                {label}
              </Link>
            ))}
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
