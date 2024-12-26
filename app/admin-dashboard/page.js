"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch all necessary data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch admin data");
        }

        const data = await response.json();
        setUsers(data.recentUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteProfile = async (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      // Remove user from the list
      setUsers(users.filter((user) => user._id !== userToDelete));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message);
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      filterValue === "" ||
      user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.email.toLowerCase().includes(filterValue.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl text-[#888]">
            {format(new Date(), "dd MMM yyyy").toUpperCase()}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/account" className="block text-xl text-[#888]">
              ACCOUNT
            </Link>
            <button
              onClick={handleLogout}
              className="text-xl text-[#888] hover:text-[#666]"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Title and Filter */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-[500]">Admin Dashboard</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-48 text-sm"
            />
          </div>
        </div>

        {/* Engineers/Users Grid */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 transform transition-all duration-200 hover:shadow-md hover:border-purple-100 hover:scale-[1.01] hover:bg-purple-50/10"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-3xl font-medium mb-2">{user.name}</h2>
                  <p className="text-xl mb-4">
                    {user.bio || "No bio available"}
                  </p>
                  <p className="text-xl text-gray-600">
                    Total reports: {user.totalInspections || 0}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Link
                    href={`/dashboard?userId=${user._id}`}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors text-center w-32"
                    prefetch={true}
                  >
                    View Reports
                  </Link>
                  <Link
                    href={`/admin/profile/${user._id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors text-center w-32"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleDeleteProfile(user._id)}
                    className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors text-center w-32"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Profile</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this profile? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
