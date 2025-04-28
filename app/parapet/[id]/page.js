"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ReportHeader } from "../../utils/addPrintButton";

export default function ViewParapetReport() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/parapet/${params.id}`);
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
    };

    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

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
          reportName={`Parapet Report - ${report.client || "No Client"}`}
          contentId="parapet-report"
        />

        <div id="parapet-report" className="bg-white rounded-lg shadow-sm">
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
            Parapet Report
          </div>

          <div className="p-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 section avoid-break">
              <div>
                <label className="font-semibold text-xl">Address:</label>
                <p>{report.address}</p>
              </div>
              <div>
                <label className="font-semibold text-xl">Date:</label>
                <p>{new Date(report.inspectionDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="font-semibold text-xl">Inspector:</label>
                <p>{report.inspectorName}</p>
              </div>
            </div>

            {/* Owner Info */}
            <div className="mb-8 mt-8 section avoid-break">
              <div className="mb-4">
                <label className="font-semibold text-xl">
                  Owner&apos;s Name:
                </label>
                <p>{report.ownerName}</p>
              </div>
              <div>
                <label className="font-semibold text-xl">
                  Owner&apos;s Contact Information:
                </label>
                <p>{report.ownerContactInfo}</p>
              </div>
            </div>

            {/* Site Inspector Section */}
            <div className="px-10 mb-6 section avoid-break">
              {/* Site Inspector Content */}
            </div>

            {/* Location Map Section */}
            <div className="flex flex-col items-center mb-8 section avoid-break">
              <h3 className="font-semibold mb-4 text-2xl">Location Map</h3>
              <div className="border border-dashed border-gray-300 p-4 w-full photo-container avoid-break scale-down-on-break">
                {report.locationMap ? (
                  <img
                    src={report.locationMap}
                    alt="Location Map"
                    className="w-full h-auto object-contain avoid-break scale-down-on-break"
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
                    No Map Image
                  </div>
                )}
              </div>
            </div>

            {/* Building Details Section */}
            <div className="mb-10 section avoid-break">
              <h3 className="font-semibold mb-4 text-xl">
                Parapet construction details, including material, height, and
                thickness:
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-gray-600">Material:</label>
                  <p>{report.parapetConstructionDetails.material}</p>
                </div>
                <div>
                  <label className="block text-gray-600">Height:</label>
                  <p>{report.parapetConstructionDetails.height}</p>
                </div>
                <div>
                  <label className="block text-gray-600">Thickness:</label>
                  <p>{report.parapetConstructionDetails.thickness}</p>
                </div>
              </div>
            </div>

            <div className="section avoid-break">
              {/* Inspection Items */}
              <div className="mb-8 section avoid-break">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold p-2 w-1/3 text-xl">
                        Item
                      </th>
                      <th className="text-left font-semibold p-2 w-2/3 text-xl">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(report.inspectionItems).map(
                      ([key, value]) => (
                        <tr key={key} className="border-t border-gray-200">
                          <td className="p-2 align-top">
                            {key === "parapetPlumb" ? (
                              <>
                                Parapet Plumb
                                <div className="text-xs text-gray-500 mt-1">
                                  Check if the parapet is plumb by a horizontal
                                  distance within one-eighth of its
                                  cross-sectional thickness in any location.
                                </div>
                              </>
                            ) : (
                              key.split(/(?=[A-Z])/).join(" ")
                            )}
                          </td>
                          <td className="p-2">{value.notes}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Appurtenances */}
              <div className="mb-8 section avoid-break">
                <h3 className="font-semibold mb-4 text-xl">Appurtenances</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check that appurtenances attached to or supported by the
                  parapet are installed and maintained in a stable condition.
                  This includes:
                </p>
                <table className="w-full border-collapse">
                  <tbody>
                    {Object.entries(report.appurtenances).map(
                      ([key, value]) => (
                        <tr key={key} className="border-t border-gray-200">
                          <td className="p-2 w-1/3">
                            {key.split(/(?=[A-Z])/).join(" ")}
                          </td>
                          <td className="p-2 w-2/3">{value.notes}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Other */}
            <div className="mb-8 section avoid-break">
              <h3 className="font-semibold mb-4 text-xl">Other</h3>
              <p>{report.other}</p>
            </div>

            {/* Photographs Section */}
            <div className="mb-8">
              <h3 className=" font-semibold mb-4 text-xl">PHOTOGRAPHS</h3>
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
