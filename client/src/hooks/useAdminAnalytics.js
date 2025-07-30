import { useState, useEffect } from "react";
import { adminService } from "@/services/admin";
import toast from "react-hot-toast";

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};
