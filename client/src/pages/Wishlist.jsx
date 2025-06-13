import React from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import PropertyGrid from '@/components/property/PropertyGrid';
import { useAuth } from '@/hooks/useAuth';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, toggleWishlist, wishlistIds } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your wishlist
          </h1>
          <Button onClick={() => navigate('/')} className="bg-wanderlust-500 hover:bg-wanderlust-600">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
            <p className="text-gray-600 mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start exploring and save properties you love!
            </p>
            <Button 
              onClick={() => navigate('/search')}
              className="bg-wanderlust-500 hover:bg-wanderlust-600"
            >
              Explore Properties
            </Button>
          </div>
        ) : (
          <PropertyGrid
            properties={wishlist}
            onWishlistToggle={toggleWishlist}
            wishlist={wishlistIds}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;