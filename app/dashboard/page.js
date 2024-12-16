import Link from "next/link";
import React from "react";

export default function Dashboard() {
  return (
    <div className="max-w-6xl w-[85%] mx-auto pt-8">
      <div className="flex justify-between mb-8">
        <p className="text-xl text-[#888]">16 DEC 2024</p>
        <Link href="/account" className="block text-xl text-[#888]">
          ACCOUNT
        </Link>
      </div>
      <div className="flex justify-between">
        <p className="text-3xl font-[500]">My reports</p>
        <div>
          <Link
            href="/sort"
            className=" px-4 py-2 rounded-sm font-[400] text-xl text-center"
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
