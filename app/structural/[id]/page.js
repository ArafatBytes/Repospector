"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ViewStructuralReport() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      if (!params?.id) return;

      try {
        const response = await fetch(`/api/structural/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [params?.id]);

  if (loading) {
    return <div className="text-center mt-8">Loading report...</div>;
  }

  if (!report) {
    return <div className="text-center mt-8">Report not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-right mb-4">
        <Link
          href="/dashboard"
          className="text-[#0066A1] hover:text-[#004d7a] transition-colors text-base inline-flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white">
        {/* Company Header */}
        <div className="mb-8">
          <h1 className="text-[#0066A1] text-2xl font-bold">SHAHRISH</h1>
          <p className="text-sm">
            ENGINEERING | PLANNING | CONSTRUCTION INSPECTION
          </p>
          <p className="text-sm">CERTIFIED DB/MBE</p>
          <div className="text-sm text-right mt-[-40px]">
            <p>555 Broadhollow Road, Suite 216</p>
            <p>Melville, NY 11747</p>
            <p>631.578.2493</p>
          </div>
        </div>

        {/* Report Title */}
        <h2 className="text-xl font-bold text-center border-t border-b border-gray-300 py-4 mb-8">
          STRUCTURAL INSPECTION REPORT
        </h2>

        {/* Basic Info */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="font-semibold block mb-2">Location:</label>
            <p className="border-b border-gray-300 py-1">{report.location}</p>
          </div>

          <div>
            <label className="font-semibold block mb-2">Description:</label>
            <p className="border-b border-gray-300 py-1">
              {report.description}
            </p>
          </div>

          <div>
            <label className="font-semibold block mb-2">Issues:</label>
            <div className="space-y-2">
              {report.issues.map((issue, index) => (
                <p key={index} className="border-b border-gray-300 py-1">
                  {issue}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Photographs */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">PHOTOGRAPHS:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.photographs.map((photo, index) => (
              <div key={index} className="relative">
                <Image
                  src={photo.image}
                  alt={`Photograph ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain rounded"
                />
                <p className="mt-2 text-sm text-gray-600">
                  {photo.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
