import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Home as HomeIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyGrid from "@/components/property/PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
import { useWishlist } from "@/hooks/useWishlist";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wanderlust-50 to-wanderlust-100 py-12 md:py-20 lg:py-32 overflow-hidden">
        {/* Background travel icons */}
        <img
          src="/assets/bg-icons/balloon.png"
          alt=""
          className="absolute top-10 left-8 w-16 opacity-20 pointer-events-none"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(68%) sepia(36%) saturate(618%) hue-rotate(339deg) brightness(96%) contrast(88%)",
          }}
        />
        <img
          src="/assets/bg-icons/suitcase1.png"
          alt=""
          className="absolute top-10 right-24 w-16 opacity-20 pointer-events-none"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(68%) sepia(36%) saturate(618%) hue-rotate(339deg) brightness(96%) contrast(88%)",
          }}
        />
        <img
          src="/assets/bg-icons/airplane.png"
          alt=""
          className="absolute top-1/3 right-8 w-16 opacity-20 pointer-events-none rotate-12"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(68%) sepia(36%) saturate(618%) hue-rotate(339deg) brightness(96%) contrast(88%)",
          }}
        />
        <img
          src="/assets/bg-icons/map.png"
          alt=""
          className="absolute bottom-12 left-12 w-16 opacity-20 pointer-events-none"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(68%) sepia(36%) saturate(618%) hue-rotate(339deg) brightness(96%) contrast(88%)",
          }}
        />
        <img
          src="/assets/bg-icons/palm.png"
          alt=""
          className="absolute bottom-10 right-12 w-16 opacity-20 pointer-events-none"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(68%) sepia(36%) saturate(618%) hue-rotate(339deg) brightness(96%) contrast(88%)",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Find your perfect
              <span className="gradient-text block mt-1">wanderlust</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              Discover unique homes, apartments, and experiences around the
              world. Your next adventure starts here.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto text-center">
            <div className="p-2 md:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                1M+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Properties</div>
            </div>
            <div className="p-2 md:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                220+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Countries</div>
            </div>
            <div className="p-2 md:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                50M+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Guests</div>
            </div>
            <div className="p-2 md:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                4.8★
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Average Rating
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
