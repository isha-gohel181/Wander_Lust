// client/src/hooks/useProperty.js
import { useState, useEffect } from "react";
import { propertyService } from "../services/properties";
import toast from "react-hot-toast";

export const useProperty = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await propertyService.getProperty(propertyId);
        setProperty(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const refresh = async () => {
    if (!propertyId) return;

    try {
      const data = await propertyService.getProperty(propertyId);
      setProperty(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return {
    property,
    loading,
    error,
    refresh,
  };
};
