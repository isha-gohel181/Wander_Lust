import { useState, useEffect } from "react";
import { adminService } from "@/services/admin";
import toast from "react-hot-toast";

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers(
        page,
        pagination.limit,
        search
      );
      setUsers(data.users);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role);
      toast.success("User role updated successfully");
      fetchUsers(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  const suspendUser = async (userId) => {
    try {
      await adminService.suspendUser(userId);
      toast.success("User suspended successfully");
      fetchUsers(); // Refresh the list
    } catch (err) {
      toast.error("Failed to suspend user");
    }
  };

  const searchUsers = (term) => {
    fetchUsers(1, term);
  };

  return {
    users,
    loading,
    error,
    pagination,
    updateUserRole,
    suspendUser,
    searchUsers,
    fetchUsers,
  };
};
