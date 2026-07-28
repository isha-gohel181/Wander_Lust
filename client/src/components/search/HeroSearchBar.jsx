// client/src/components/search/HeroSearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar as CalendarIcon, Users, Search, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const POPULAR_DESTINATIONS = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Bali",
  "Rome",
  "Barcelona",
  "Los Angeles",
];

const HeroSearchBar = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [locationOpen, setLocationOpen] = useState(false);

  const totalGuests = guests.adults + guests.children + guests.infants;

  const handleSearch = (e) => {
    e?.preventDefault();
    const searchParams = new URLSearchParams();

    if (destination.trim()) {
      searchParams.set("destination", destination.trim());
    }
    if (checkIn) {
      searchParams.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    }
    if (checkOut) {
      searchParams.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    }
    if (totalGuests > 1) {
      searchParams.set("guests", totalGuests.toString());
    }

    navigate(`/search?${searchParams.toString()}`);
  };

  const updateGuests = (type, delta) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(type === "adults" ? 1 : 0, prev[type] + delta),
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="bg-white/95 backdrop-blur-md rounded-full shadow-2xl p-2 sm:p-2.5 border border-white/60 flex flex-col lg:flex-row items-center justify-between gap-2 text-gray-800"
      >
        {/* 1. Location */}
        <div className="w-full lg:w-1/3 px-4 py-2 flex items-center space-x-3 cursor-pointer group rounded-full hover:bg-gray-50 transition-colors relative">
          <MapPin className="h-5 w-5 text-gray-400 group-hover:text-wanderlust-500 transition-colors flex-shrink-0" />
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverTrigger asChild>
              <div className="flex-1 text-left select-none">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Location
                </div>
                <div className="flex items-center justify-between text-sm font-medium text-gray-800 truncate">
                  <span>{destination || "Where to?"}</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400 ml-1 flex-shrink-0" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-3 z-50">
              <div className="space-y-2">
                <Input
                  placeholder="Search city or country..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="text-sm"
                  autoFocus
                />
                <div className="text-xs font-semibold text-gray-400 pt-1">
                  Popular Destinations
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {POPULAR_DESTINATIONS.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setDestination(city);
                        setLocationOpen(false);
                      }}
                      className="text-left text-xs px-2.5 py-1.5 rounded-md hover:bg-wanderlust-50 hover:text-wanderlust-600 transition-colors truncate font-medium"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden lg:block h-8 w-px bg-gray-200" />

        {/* 2. Check In - Check Out */}
        <div className="w-full lg:w-1/3 px-4 py-2 flex items-center space-x-3 cursor-pointer group rounded-full hover:bg-gray-50 transition-colors">
          <CalendarIcon className="h-5 w-5 text-gray-400 group-hover:text-wanderlust-500 transition-colors flex-shrink-0" />
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex-1 text-left select-none">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Dates
                </div>
                <div className="flex items-center justify-between text-sm font-medium text-gray-800 truncate">
                  <span>
                    {checkIn && checkOut
                      ? `${format(checkIn, "MMM dd")} - ${format(checkOut, "MMM dd")}`
                      : checkIn
                      ? format(checkIn, "MMM dd")
                      : "Check in - Check out"}
                  </span>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400 ml-1 flex-shrink-0" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-auto p-0 z-50">
              <div className="p-3 border-b flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">Select Check-in Date</span>
                {checkIn && (
                  <button
                    type="button"
                    onClick={() => {
                      setCheckIn(null);
                      setCheckOut(null);
                    }}
                    className="text-xs text-rose-500 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(date) => {
                  if (!checkIn || (checkIn && date < checkIn)) {
                    setCheckIn(date);
                    setCheckOut(null);
                  } else {
                    setCheckOut(date);
                  }
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md border-0"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden lg:block h-8 w-px bg-gray-200" />

        {/* 3. Person / Guests */}
        <div className="w-full lg:w-1/3 px-4 py-2 flex items-center space-x-3 cursor-pointer group rounded-full hover:bg-gray-50 transition-colors">
          <Users className="h-5 w-5 text-gray-400 group-hover:text-wanderlust-500 transition-colors flex-shrink-0" />
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex-1 text-left select-none">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Guests
                </div>
                <div className="flex items-center justify-between text-sm font-medium text-gray-800 truncate">
                  <span>
                    {totalGuests} {totalGuests === 1 ? "Person" : "Guests"}
                  </span>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400 ml-1 flex-shrink-0" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-4 z-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Adults</div>
                  <div className="text-xs text-gray-500">Ages 13 or above</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => updateGuests("adults", -1)}
                    disabled={guests.adults <= 1}
                  >
                    -
                  </Button>
                  <span className="text-sm w-4 text-center">{guests.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => updateGuests("adults", 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Children</div>
                  <div className="text-xs text-gray-500">Ages 2–12</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => updateGuests("children", -1)}
                    disabled={guests.children <= 0}
                  >
                    -
                  </Button>
                  <span className="text-sm w-4 text-center">{guests.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => updateGuests("children", 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Infants</div>
                  <div className="text-xs text-gray-500">Under 2</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => updateGuests("infants", -1)}
                    disabled={guests.infants <= 0}
                  >
                    -
                  </Button>
                  <span className="text-sm w-4 text-center">{guests.infants}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => updateGuests("infants", 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* 4. Search Button */}
        <button
          type="submit"
          className="w-full lg:w-auto bg-wanderlust-500 hover:bg-wanderlust-600 text-white font-medium px-7 py-3 rounded-full flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0 cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm font-semibold">Search</span>
        </button>
      </form>
    </div>
  );
};

export default HeroSearchBar;
