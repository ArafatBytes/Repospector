"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/account");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [router]);

  if (!user) return null;

  const handleEdit = () => {
    setEditData({
      name: user.name,
      username: user.username,
      bio: user.bio,
      experience: user.experience,
      avatar: user.avatar,
    });
    setIsEditing(true);
    setError("");
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/user/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update user data");
        return;
      }

      setUser({ ...user, ...editData });
      setIsEditing(false);
      setError("");
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user data");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setError("");
  };

  const handleUpdatePassword = async () => {
    setPasswordError("");

    // Validate passwords
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch("/api/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update password");
        return;
      }

      // Reset form and show success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsUpdatingPassword(false);
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl font-normal mb-8 font-satoshi tracking-wide">
          MY ACCOUNT
        </h1>

        {error && (
          <div className="text-red-500 text-center mb-4 text-sm">{error}</div>
        )}

        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-32 h-32 rounded-full bg-[#F3F0FF] flex items-center justify-center ${
              isEditing ? "cursor-pointer hover:opacity-80" : ""
            }`}
            onClick={handleAvatarClick}
          >
            {editData.avatar || user.avatar ? (
              <Image
                src={editData.avatar || user.avatar}
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-[#F3F0FF]" />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Username */}
        <div className="text-center text-gray-600 mb-12">
          {isEditing ? (
            <input
              type="text"
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
              className="text-center border-b border-gray-300 focus:border-[#834CFF] outline-none font-medium"
            />
          ) : (
            <div className="font-medium">{user.username}</div>
          )}
        </div>

        {isUpdatingPassword ? (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Update Password</h2>
            {passwordError && (
              <div className="text-red-500 text-sm mb-4">{passwordError}</div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full border-b border-gray-300 focus:border-[#834CFF] outline-none py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border-b border-gray-300 focus:border-[#834CFF] outline-none py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border-b border-gray-300 focus:border-[#834CFF] outline-none py-1"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdatePassword}
                className="flex-1 bg-[#834CFF] text-white rounded-md py-2 px-4 hover:bg-[#6617CB] transition-colors font-medium"
              >
                Update Password
              </button>
              <button
                onClick={() => {
                  setIsUpdatingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setPasswordError("");
                }}
                className="flex-1 border border-[#834CFF] text-[#834CFF] rounded-md py-2 px-4 hover:bg-[#F3F0FF] transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Name Section */}
            <div className="mb-6 flex items-start">
              <label className="text-[#834CFF] text-base font-semibold w-24">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#834CFF] outline-none"
                />
              ) : (
                <div className="flex-1 text-gray-700 font-normal">
                  {user.name}
                </div>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-6 flex items-start">
              <label className="text-[#834CFF] text-base font-semibold w-24">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData({ ...editData, bio: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#834CFF] outline-none min-h-[60px]"
                />
              ) : (
                <div className="flex-1 text-gray-700 font-normal">
                  {user.bio || "No bio added yet"}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-[#E6E0FF] rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <label className="text-[#834CFF] text-base font-semibold mb-1">
                    Total Inspections
                  </label>
                  <div className="text-gray-700 font-medium">
                    {user.totalInspections || 0}
                  </div>
                </div>
              </div>
              <div className="bg-[#E6E0FF] rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <label className="text-[#834CFF] text-base font-semibold mb-1">
                    Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.experience}
                      onChange={(e) =>
                        setEditData({ ...editData, experience: e.target.value })
                      }
                      className="w-20 text-center border-b border-gray-300 focus:border-[#834CFF] outline-none"
                    />
                  ) : (
                    <div className="text-gray-700 font-medium">
                      {user.experience || "Not specified"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#834CFF] text-white rounded-md py-2 px-4 hover:bg-[#6617CB] transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 border border-[#834CFF] text-[#834CFF] rounded-md py-2 px-4 hover:bg-[#F3F0FF] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex-1 bg-[#834CFF] text-white rounded-md py-2 px-4 hover:bg-[#6617CB] transition-colors font-medium"
                  >
                    Edit Info
                  </button>
                  <button
                    onClick={() => setIsUpdatingPassword(true)}
                    className="flex-1 border border-[#834CFF] text-[#834CFF] rounded-md py-2 px-4 hover:bg-[#F3F0FF] transition-colors font-medium"
                  >
                    Update Password
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
