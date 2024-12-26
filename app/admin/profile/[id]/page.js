"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UserProfile() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.id}/profile`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUserData();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-8 sm:px-6 lg:px-8">
        {/* Back to Admin Dashboard */}
        <div className="mb-8">
          <Link
            href="/admin-dashboard"
            className="text-[#834CFF] hover:text-[#6617CB] transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-center text-2xl font-normal mb-8">USER ACCOUNT</h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full bg-[#F3F0FF] flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-[#F3F0FF]" />
            )}
          </div>
        </div>

        {/* Username */}
        <div className="text-center mb-8">
          <div className="text-gray-600">{user.username}</div>
        </div>

        {/* User Details */}
        <div className="space-y-6">
          {/* Name Section */}
          <div className="mb-6 flex items-start">
            <label className="text-[#834CFF] text-base font-semibold w-24">
              Name
            </label>
            <div className="flex-1 text-gray-700 font-normal">{user.name}</div>
          </div>

          {/* Email Section */}
          <div className="mb-6 flex items-start">
            <label className="text-[#834CFF] text-base font-semibold w-24">
              Email
            </label>
            <div className="flex-1 text-gray-700 font-normal">{user.email}</div>
          </div>

          {/* Bio Section */}
          <div className="mb-6 flex items-start">
            <label className="text-[#834CFF] text-base font-semibold w-24">
              Bio
            </label>
            <div className="flex-1 text-gray-700 font-normal">
              {user.bio || "No bio added yet"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F3F0FF] rounded-lg p-4">
              <div className="flex flex-col items-center text-center">
                <label className="text-[#834CFF] text-base font-semibold mb-1">
                  Total Inspections
                </label>
                <div className="text-gray-700 font-medium">
                  {user.totalInspections}
                </div>
              </div>
            </div>

            <div className="bg-[#F3F0FF] rounded-lg p-4">
              <div className="flex flex-col items-center text-center">
                <label className="text-[#834CFF] text-base font-semibold mb-1">
                  Experience
                </label>
                <div className="text-gray-700 font-medium">
                  {user.experience || "Not specified"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
