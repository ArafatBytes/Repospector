"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ReportHeader } from "../../utils/addPrintButton";

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
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReportHeader
          reportId={report._id}
          reportName={`Structural Report - ${report.client || "No Client"}`}
          contentId="structural-report"
        />

        <div id="structural-report" className="bg-white rounded-lg shadow-sm">
          {/* Header with Logo and Address */}
          <div className="flex justify-between items-start p-6 border-b section avoid-break">
            {/* Logo on the left */}
            <div>
              <img
                src="/images/logo.jpg"
                alt="SHAHRISH"
                width={300}
                height={100}
                style={{ width: "300px", height: "auto", objectFit: "contain" }}
                className="logo-image"
              />
            </div>
            {/* Company Address on the right */}
            <div className="text-right text-sm">
              <p>
                <strong>NYC DOB SIA# 008524</strong>
              </p>
              <p>15 WEST 38TH STREET, 8TH FLOOR (SUITE 808)</p>
              <p>NEW YORK, NEW YORK 10018</p>
              <p>T: (212) 632-8430</p>
            </div>
          </div>

          {/* Header */}
          <div
            className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-2xl font-medium section avoid-break"
            style={{
              backgroundColor: "#4A90E2 !important",
              color: "white !important",
            }}
          >
            Structural Report
          </div>

          <div className="p-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 section avoid-break">
              <div>
                <label className="font-semibold block mb-2 text-xl">
                  Location:
                </label>
                <p className="border-b border-gray-300 py-1">
                  {report.location}
                </p>
              </div>

              <div>
                <label className="font-semibold block mb-2 text-xl">
                  Description:
                </label>
                <p className="border-b border-gray-300 py-1">
                  {report.description}
                </p>
              </div>

              <div>
                <label className="font-semibold block mb-2 text-xl">
                  Issues:
                </label>
                <div className="space-y-2">
                  {report.issues.map((issue, index) => (
                    <p key={index} className="border-b border-gray-300 py-1">
                      {issue}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Site Inspector Section */}
            <div className="px-10 mb-6 section avoid-break">
              {/* ... existing site inspector content ... */}
            </div>

            {/* Location Map Section */}
            <div className="flex flex-col items-center mb-8 section avoid-break">
              {/* ... existing location map content ... */}
            </div>

            {/* Building Details Section */}
            <div className="px-10 mb-10 section avoid-break">
              {/* ... existing building details content ... */}
            </div>

            {/* Photographs Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">PHOTOGRAPHS</h3>
              <div className="flex flex-col gap-8">
                {report.photographs && report.photographs.length === 0 && (
                  <div className="text-gray-500 text-center">
                    No photographs uploaded
                  </div>
                )}
                {report.photographs &&
                  report.photographs.map((photo, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-300 rounded-md p-4 flex flex-col items-center photo-container avoid-break scale-down-on-break"
                    >
                      {photo.image ? (
                        <img
                          src={photo.image}
                          alt={`Photo ${idx + 1}`}
                          className="avoid-break scale-down-on-break"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            display: "block",
                            margin: "0 auto",
                            background: "#f3f4f6",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <div className="w-full flex items-center justify-center bg-gray-100 text-gray-400 h-64 rounded-md">
                          No Image
                        </div>
                      )}
                      <div className="mt-2 text-center text-sm text-gray-700">
                        {photo.caption || `Photo ${idx + 1}`}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recommendations and Remarks Section */}
            <div className="px-10 mb-10 section avoid-break">
              {/* ... existing remarks content ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
