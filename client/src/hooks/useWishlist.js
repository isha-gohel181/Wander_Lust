//client/src/hooks/useWishlist.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { authService } from "../services/auth";
import toast from "react-hot-toast";

export const useWishlist = () => {
  const { isSignedIn, isLoaded } = useAuth(); // Get auth state from Clerk
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    // Only fetch if user is signed in
    if (!isSignedIn) {
      setWishlist([]);
      setWishlistIds(new Set());
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await authService.getWishlist();
      setWishlist(data);
      setWishlistIds(new Set(data.map((property) => property._id)));
    } catch (err) {
      setError(err.message);
      // Don't show error toast for wishlist as it's not critical
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    // Only fetch when Clerk has loaded and we have auth state
    if (isLoaded) {
      fetchWishlist();
    }
  }, [fetchWishlist, isLoaded]);

  const toggleWishlist = async (propertyId) => {
    // Require authentication for wishlist actions
    if (!isSignedIn) {
      toast.error("Please sign in to use the wishlist");
      return;
    }

    try {
      const isInWishlist = wishlistIds.has(propertyId);

      if (isInWishlist) {
        await authService.removeFromWishlist(propertyId);
        setWishlist((prev) =>
          prev.filter((property) => property._id !== propertyId)
        );
        setWishlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
        toast.success("Removed from wishlist");
      } else {
        await authService.addToWishlist(propertyId);
        setWishlistIds((prev) => new Set([...prev, propertyId]));
        toast.success("Added to wishlist");
        // Optionally refresh full wishlist to get property details
        fetchWishlist();
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const isInWishlist = (propertyId) => {
    return wishlistIds.has(propertyId);
  };

  return {
    wishlist,
    wishlistIds: Array.from(wishlistIds),
    loading,
    error,
    toggleWishlist,
    isInWishlist,
    refresh: fetchWishlist,
    isAuthenticated: isSignedIn,
  };
}