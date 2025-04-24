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

        <div
          id="structural-report"
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {/* Header with Logo and Address */}
          <div className="flex justify-between items-start p-6 border-b">
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
    </div>
  );
}
