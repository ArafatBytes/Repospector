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
            className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-xl font-medium section avoid-break"
            style={{
              backgroundColor: "#4A90E2 !important",
              color: "white !important",
            }}
          >
            Parapet Report
          </div>

          <div className="p-6">
            {/* Report Title */}
            <h2 className="text-xl font-bold text-center border-t border-b border-gray-300 py-4 mb-8">
              ANNUAL PARAPET INSPECTION REPORT
            </h2>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 section avoid-break">
              <div>
                <label className="font-semibold">Address:</label>
                <p>{report.address}</p>
              </div>
              <div>
                <label className="font-semibold">Date:</label>
                <p>{new Date(report.inspectionDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="font-semibold">Inspector:</label>
                <p>{report.inspectorName}</p>
              </div>
            </div>

            {/* Owner Info */}
            <div className="mb-8">
              <div className="mb-4">
                <label className="font-semibold">Owner&apos;s Name:</label>
                <p>{report.ownerName}</p>
              </div>
              <div>
                <label className="font-semibold">
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
              <h3 className="font-semibold mb-4">Location Map</h3>
              <div className="border border-dashed border-gray-300 p-4">
                {report.locationMap && (
                  <Image
                    src={report.locationMap}
                    alt="Location Map"
                    width={800}
                    height={400}
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
            </div>

            {/* Building Details Section */}
            <div className="px-10 mb-10 section avoid-break">
              <h3 className="font-semibold mb-4">
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

            {/* Inspection Items */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left font-semibold p-2 w-1/3">Item</th>
                    <th className="text-left font-semibold p-2 w-2/3">Notes</th>
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
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Appurtenances</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check that appurtenances attached to or supported by the parapet
                are installed and maintained in a stable condition. This
                includes:
              </p>
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(report.appurtenances).map(([key, value]) => (
                    <tr key={key} className="border-t border-gray-200">
                      <td className="p-2 w-1/3">
                        {key.split(/(?=[A-Z])/).join(" ")}
                      </td>
                      <td className="p-2 w-2/3">{value.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Other */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Other</h3>
              <p>{report.other}</p>
            </div>

            {/* Photographs Section */}
            <div className="flex flex-col items-center mb-10 photos-section avoid-break">
              <h2 className="text-2xl font-bold underline mb-4 text-center">
                PHOTOGRAPHS
              </h2>
              {report.photographs && report.photographs.length === 0 && (
                <div className="text-gray-500">No photographs uploaded</div>
              )}
              {report.photographs &&
                report.photographs.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center mb-6 w-full photo-container avoid-break"
                  >
                    <Image
                      src={img.file}
                      alt={`Photograph ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-auto h-auto max-w-full avoid-break"
                    />
                    <div className="mt-4 text-center">
                      <p className="text-gray-700">{img.description}</p>
                    </div>
                  </div>
                ))}
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
