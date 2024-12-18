"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Force a hard refresh to clear any cached states
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="max-w-6xl w-[85%] mx-auto pt-8">
      <div className="flex justify-between mb-8">
        <p className="text-xl text-[#888]">16 DEC 2024</p>
        <div className="flex items-center gap-6">
          <Link href="/account" className="block text-xl text-[#888]">
            ACCOUNT
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center text-lg bg-[#834CFF] text-white px-3 py-1.5 rounded-md hover:bg-[#6617CB] transition-colors"
          >
            <span>LOGOUT</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-3xl font-[500]">My reports</p>
        <div>
          <Link
            href="/sort"
            className="px-4 py-2 rounded-sm font-[400] text-xl text-center"
          >
            Sort
          </Link>
          <Link
            href="/create"
            className="bg-[#834CFF] px-4 py-2 rounded-sm text-white font-[400] text-xl text-center"
          >
            Create New
          </Link>
        </div>
      </div>
    </div>
  );
}
