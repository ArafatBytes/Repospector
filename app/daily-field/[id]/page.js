"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";
import Image from "next/image";

export default function ViewDailyFieldReport() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/daily-field/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReportHeader
          reportId={report._id}
          reportName={`Daily Field Report - ${report.client || "No Client"}`}
          contentId="daily-field-report"
        />

        <div id="daily-field-report" className="bg-white rounded-lg shadow-sm">
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
            Daily Field Report
          </div>

          <div className="p-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 section avoid-break">
              {/* Left Column */}
              <div>
                <div className="mb-4">
                  <span className="font-medium">Client: </span>
                  <span>{report.client}</span>
                </div>
                <div className="mb-4">
                  <span className="font-medium">Project Site Address: </span>
                  <span>{report.projectSiteAddress}</span>
                </div>
                <div className="mb-4">
                  <span className="font-medium">DOB Job Number: </span>
                  <span>{report.dobJobNumber}</span>
                </div>
                <div className="mb-4">
                  <span className="font-medium">Inspector Name: </span>
                  <span>{report.inspectorName}</span>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-4">
                  <span className="font-medium">Inspection Date: </span>
                  <span>
                    {format(new Date(report.inspectionDate), "MM.dd.yyyy")}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="font-medium">Time In/Out: </span>
                  <span>{report.timeInOut}</span>
                </div>
                <div className="mb-4">
                  <span className="font-medium">Report Number: </span>
                  <span>{report.reportNumber}</span>
                </div>
                <div className="mb-4">
                  <span className="font-medium">Site Weather (°F): </span>
                  <span>{report.siteWeather}</span>
                </div>
              </div>
            </div>

            {/* Site Inspector Section */}
            <div className=" mb-6 section avoid-break">
              {/* Contractor Information */}
              <div className="mb-6">
                <div className="font-bold mb-2">CONTRACTOR:</div>
                <div className="border border-gray-300 p-3">
                  <div className="mb-2">{report.contractor.name}</div>
                  <div>
                    NYC DOB Contractor ID # {report.contractor.dobContractorId}
                  </div>
                </div>
              </div>

              {/* Activities Table */}
              <div className="mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 w-1/3 font-medium">
                        Labor & Equipment
                      </td>
                      <td className="border border-gray-300 p-2">
                        {report.laborAndEquipment}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Activities for the Day
                      </td>
                      <td className="border border-gray-300 p-2">
                        {report.activitiesForDay}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">
                        Planned Activities for Tomorrow
                      </td>
                      <td className="border border-gray-300 p-2">
                        {report.plannedActivitiesForTomorrow}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signature Section */}
              <div className="mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 w-1/3">
                        <div className="font-medium">
                          Signature of the Professional Engineer
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2 text-right italic">
                        {report.signatureOfProfessionalEngineer}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
              <h3 className="text-lg font-semibold mb-4">PHOTOGRAPHS</h3>
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
