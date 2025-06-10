// client/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-wanderlust-500 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Page not found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full bg-wanderlust-500 hover:bg-wanderlust-600">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>

          <Link to="/search">
            <Button variant="outline" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
