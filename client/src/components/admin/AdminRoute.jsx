import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Access Denied. Admin privileges required to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
