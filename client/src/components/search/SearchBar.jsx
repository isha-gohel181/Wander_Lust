// client/src/components/search/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const SearchBar = ({ onClose }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: null,
    checkOut: null,
    guests: {
      adults: 1,
      children: 0,
      infants: 0,
    },
  });

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (searchData.destination) {
      searchParams.set("destination", searchData.destination);
    }
    if (searchData.checkIn) {
      searchParams.set("checkIn", format(searchData.checkIn, "yyyy-MM-dd"));
    }
    if (searchData.checkOut) {
      searchParams.set("checkOut", format(searchData.checkOut, "yyyy-MM-dd"));
    }

    const totalGuests =
      searchData.guests.adults +
      searchData.guests.children +
      searchData.guests.infants;
    if (totalGuests > 1) {
      searchParams.set("guests", totalGuests.toString());
    }

    navigate(`/search?${searchParams.toString()}`);
    onClose?.();
  };

  const updateGuests = (type, increment) => {
    setSearchData((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(0, prev.guests[type] + increment),
      },
    }));
  };

  const totalGuests =
    searchData.guests.adults +
    searchData.guests.children +
    searchData.guests.infants;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row bg-white border border-gray-300 rounded-full lg:rounded-full shadow-lg overflow-hidden">
        {/* Destination */}
        <div className="flex-1 p-4 lg:p-3">
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Where
              </label>
              <Input
                type="text"
                placeholder="Search destinations"
                value={searchData.destination}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                className="border-0 p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-px bg-gray-200"></div>

        {/* Check-in */}
        <div className="flex-1 p-4 lg:p-3">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Check in
                  </label>
                  <div className="text-sm text-gray-900">
                    {searchData.checkIn
                      ? format(searchData.checkIn, "MMM dd")
                      : "Add dates"}
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={searchData.checkIn}
                onSelect={(date) =>
                  setSearchData((prev) => ({ ...prev, checkIn: date }))
                }
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden lg:block w-px bg-gray-200"></div>

        {/* Check-out */}
        <div className="flex-1 p-4 lg:p-3">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Check out
                  </label>
                  <div className="text-sm text-gray-900">
                    {searchData.checkOut
                      ? format(searchData.checkOut, "MMM dd")
                      : "Add dates"}
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={searchData.checkOut}
                onSelect={(date) =>
                  setSearchData((prev) => ({ ...prev, checkOut: date }))
                }
                disabled={(date) =>
                  date < searchData.checkIn || date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden lg:block w-px bg-gray-200"></div>

        {/* Guests */}
        <div className="flex-1 p-4 lg:p-3">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer">
                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Who
                  </label>
                  <div className="text-sm text-gray-900">
                    {totalGuests === 1 ? "1 guest" : `${totalGuests} guests`}
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-gray-500">
                      Ages 13 or above
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests("adults", -1)}
                      disabled={searchData.guests.adults <= 1}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">
                      {searchData.guests.adults}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests("adults", 1)}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-gray-500">Ages 2-12</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests("children", -1)}
                      disabled={searchData.guests.children <= 0}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">
                      {searchData.guests.children}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests("children", 1)}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-sm text-gray-500">Under 2</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests("infants", -1)}
                      disabled={searchData.guests.infants <= 0}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">
                      {searchData.guests.infants}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGuests("infants", 1)}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="p-4 lg:p-2">
          <Button
            onClick={handleSearch}
            className="w-full lg:w-auto bg-wanderlust-500 hover:bg-wanderlust-600 rounded-full h-12 lg:h-12 lg:w-12"
          >
            <Search className="h-4 w-4 lg:mr-0 mr-2" />
            <span className="lg:hidden">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
