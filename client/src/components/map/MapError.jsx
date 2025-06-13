import React from "react";
import { MapPin } from "lucide-react";

const MapError = ({ message = "Location not available" }) => {
  return (
    <div className="h-full w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
      <div className="text-center p-4">
        <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default MapError;
