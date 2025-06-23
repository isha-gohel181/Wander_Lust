import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { authService } from "../services/auth";
import toast from "react-hot-toast";

export const useAuth = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoaded) return;

      if (!clerkUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        setUser(profile);
        setError(null);
      } catch (err) {
        // Handle timeout or server error gracefully
        const isTimeout = err.message.toLowerCase().includes("timeout");
        const isNetworkError = err.message.toLowerCase().includes("network");

        if (isTimeout) {
          toast.error("Server is taking too long. Showing limited access.");
        } else if (isNetworkError) {
          toast.error("Network error. Check your internet connection.");
        } else {
          toast.error("Failed to load profile. Showing limited access.");
        }

        if (import.meta.env.MODE === "development") {
          console.error("Failed to fetch user profile:", err);
        }

        // Fallback to basic user info
        setUser({
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          avatar: clerkUser.imageUrl || "",
          role: "guest",
        });

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [clerkUser, isLoaded]);

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      return updatedUser;
    } catch (error) {
      toast.error("Could not update profile. Try again later.");
      throw error;
    }
  };

  const becomeHost = async () => {
    try {
      const response = await authService.becomeHost();
      setUser(response.user);
      toast.success("Welcome to hosting!");
      return response;
    } catch (error) {
      toast.error("Something went wrong while becoming host.");
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    updateProfile,
    becomeHost,
    isHost: user?.role === "host" || user?.role === "admin",
    isAdmin: user?.role === "admin",
  };
};
