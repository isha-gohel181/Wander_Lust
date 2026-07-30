import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Home as HomeIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyGrid from "@/components/property/PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
import { useWishlist } from "@/hooks/useWishlist";

import HeroSearchBar from "@/components/search/HeroSearchBar";
import TestimonialsSection from "@/components/reviews/TestimonialsSection";

const Home = () => {
  const { properties, loading } = useProperties({
    limit: 8,
    featured: true,
    sortBy: "ratings.overall",
    sortOrder: "desc",
  });
  const { toggleWishlist, wishlistIds } = useWishlist();

  const destinations = [
    {
      name: "New York",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      properties: "12,000+ properties",
    },
    {
      name: "London",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
      properties: "8,500+ properties",
    },
    {
      name: "Tokyo",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      properties: "6,200+ properties",
    },
    {
      name: "Paris",
      image:
        "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFyaXN8ZW58MHx8MHx8fDA%3D",
      properties: "9,100+ properties",
    },
  ];

  const features = [
    {
      icon: <Search className="h-8 w-8 text-wanderlust-500" />,
      title: "Easy Search",
      description:
        "Find the perfect place with our advanced search and filter options.",
    },
    {
      icon: <HomeIcon className="h-8 w-8 text-wanderlust-500" />,
      title: "Verified Properties",
      description:
        "All properties are verified and reviewed by our team for quality assurance.",
    },
    {
      icon: <Users className="h-8 w-8 text-wanderlust-500" />,
      title: "Trusted Hosts",
      description:
        "Connect with experienced hosts who provide exceptional hospitality.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section Container */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-4">
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[600px] lg:min-h-[670px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white bg-gray-900">
          {/* Hero Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=2000&q=80')`,
            }}
          />
          {/* Subtle Dark Backdrop Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/75 pointer-events-none" />

          {/* Hero Top Content: Heading */}
          <div className="relative z-10 pt-4 sm:pt-8 text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] drop-shadow-lg text-white mb-10 sm:mb-14">
              Secure Your Dream Vacation
              <span className="block mt-2 font-normal italic opacity-95">with a Reservation</span>
            </h1>

            {/* Floating Search Pill Bar */}
            <div className="w-full mt-2 sm:mt-3">
              <HeroSearchBar />
            </div>
          </div>

          {/* Hero Bottom Row: Description & Metrics */}
          <div className="relative z-10 pt-10 mt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            {/* Left Paragraph */}
            <p className="text-white/90 text-sm sm:text-base font-normal max-w-md leading-relaxed drop-shadow">
              We believe in the power of the great outdoors. We think that everyone
              deserves the chance to explore the wild and to find their very own adventure.
            </p>

            {/* Right Metric Counter Stats */}
            <div className="flex items-center space-x-8 sm:space-x-12 w-full md:w-auto justify-between md:justify-end">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow">
                  121+
                </div>
                <div className="text-xs sm:text-sm text-white/80 font-light mt-0.5">
                  Capital Raised
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow">
                  80+
                </div>
                <div className="text-xs sm:text-sm text-white/80 font-light mt-0.5">
                  Happy Customers
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow">
                  1K+
                </div>
                <div className="text-xs sm:text-sm text-white/80 font-light mt-0.5">
                  Property options
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* About Section */}
      <section id="about" className="py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="order-2 lg:order-1">
              <span className="inline-block text-wanderlust-500 font-semibold text-sm tracking-wide uppercase mb-3">
                About Us
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
                The Best And Most<br />
                trusted <span className="text-wanderlust-500">service</span>
              </h2>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                We are the largest holiday service provider in the world with
                partners and places spread all over the world by prioritizing
                service and customer satisfaction.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/search">
                  <Button
                    size="lg"
                    className="bg-wanderlust-500 hover:bg-wanderlust-600 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Explore
                  </Button>
                </Link>
                <Link to="/become-a-host">
                  <Button
                    size="lg"
                    className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-normal px-8 py-3 rounded-full transition-all duration-300 shadow-none border-0"
                  >
                    Become Host
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-10 sm:gap-14 mt-10">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-wanderlust-500">
                    200+
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Customer &amp; Partners
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-wanderlust-500">
                    500+
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Place In The World
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-wanderlust-500">
                    1K+
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Success Journey
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Modern 3-Image Collage (Vertically Centered) */}
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 sm:gap-6 relative items-center">
              {/* Image 1: Main Tall Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[3/4] transform hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=900&fit=crop"
                  alt="Scenic Destination"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Stacked Images Column */}
              <div className="flex flex-col gap-4 sm:gap-6 justify-between">
                {/* Image 2: Top Right Small */}
                <div className="relative rounded-2xl overflow-hidden shadow-md aspect-square transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop"
                    alt="Tropical Beach"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Image 3: Bottom Right Small */}
                <div className="relative rounded-2xl overflow-hidden shadow-md aspect-square transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&h=600&fit=crop"
                    alt="Luxury Stay"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Popular Destinations */}
        <section className="py-10 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Popular Destinations
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Explore the world's most loved cities and discover amazing places
                to stay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {destinations.map((destination, index) => (
                <Link
                  key={index}
                  to={`/search?destination=${destination.name}`}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 text-white">
                      <h3 className="text-lg md:text-xl font-bold mb-0.5 md:mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90">
                        {destination.properties}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
              

      {/* Featured Properties */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked places that offer exceptional experiences.
              </p>
            </div>
            <Link to="/search" className="hidden md:block mt-4 sm:mt-0">
              <Button variant="outline" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="[&_.property-grid]:grid-cols-1 [&_.property-grid]:sm:grid-cols-2 [&_.property-grid]:lg:grid-cols-4">
            <PropertyGrid
              properties={properties.slice(0, window.innerWidth < 640 ? 2 : 4)}
              loading={loading}
              onWishlistToggle={toggleWishlist}
              wishlist={wishlistIds}
            />
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/search">
              <Button className="w-full sm:w-auto bg-wanderlust-500 hover:bg-wanderlust-600">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Why Choose Wanderlust?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and book unique accommodations around the
              world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 md:p-6">
                <div className="flex justify-center mb-3 md:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Host CTA Section */}
      <section className="py-10 md:py-16 lg:py-20 bg-wanderlust-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Share your space, earn extra income
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              Turn your extra space into extra income. Join millions of hosts on
              Wanderlust.
            </p>
            <Link to="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-wanderlust-500 hover:bg-wanderlust-600 text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3"
              >
                Become a Host
                <ArrowRight className="ml-2 h-4 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;