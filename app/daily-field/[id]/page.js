"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";

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
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard */}
        <ReportHeader
          reportId={report._id}
          reportName={`Daily Field Report - ${
            report.projectName || "No Project"
          }`}
          contentId="daily-field-report"
        />

        <div
          id="daily-field-report"
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {/* Report Header */}
          <div
            className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-xl font-medium -mx-6 -mt-6 mb-6"
            style={{
              backgroundColor: "#4A90E2 !important",
              color: "white !important",
            }}
          >
            Daily Field Report
          </div>

          {/* Header */}
          <div className="flex justify-between mb-8">
            {/* Left Side - Company Logo */}
            <div className="flex items-start">
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#0066A1] tracking-wider">
                  SHAHRISH
                </div>
                <div className="text-xs text-gray-500 italic">
                  ENGINEERING • SURVEYING • CONSTRUCTION INSPECTION
                </div>
              </div>
            </div>

            {/* Right Side - Agency Info */}
            <div className="text-right text-sm">
              <div className="text-[#0066A1] font-medium">
                NYC DOB SPECIAL INSPECTION AGENCY# 008524
              </div>
              <div>15 WEST 38TH STREET, SUITE 516, NEW YORK, NY 10018,</div>
              <div>T: (631) 578 2493</div>
              <div>
                E:{" "}
                <a
                  href="mailto:INSPECTION@SHAHRISH.NET"
                  className="text-[#0066A1]"
                >
                  INSPECTION@SHAHRISH.NET
                </a>
              </div>
              <div>
                W:{" "}
                <a
                  href="http://WWW.SHAHRISHENGINEERING.NET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066A1]"
                >
                  WWW.SHAHRISHENGINEERING.NET
                </a>
              </div>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
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

          {/* Title */}
          <div className="bg-[#0066A1] text-white text-center py-2 font-bold text-lg mb-6">
            DAILY FIELD REPORT
          </div>

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

          {/* Photographs Section */}
          {report.hasPhotographs && (
            <div className="mb-6">
              <div className="font-bold text-lg mb-4">PHOTOGRAPHS</div>
              <div className="grid grid-cols-2 gap-8">
                {report.photographs.map((photo, index) => (
                  <div key={index} className="border border-gray-300 p-4">
                    <div className="mb-4">
                      <img
                        src={photo.image}
                        alt={photo.caption || `Photo ${index + 1}`}
                        className="w-full object-contain"
                      />
                    </div>
                    <div className="text-center text-sm">
                      {photo.caption || `Photo ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
