"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";

export default function ViewFirestoppingReport() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/firestopping/${params.id}`);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!report) {
    return <div>Report not found</div>;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <ReportHeader
          reportId={report._id}
          reportName={`Firestopping Report - ${report.client || "No Client"}`}
          contentId="firestopping-report"
        />

        <div
          id="firestopping-report"
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
            Firestopping Report
          </div>

          {/* Header */}
          <div className="flex justify-between mb-8">
            {/* Company Logo and Info */}
            <div>
              <h1 className="text-[#0066A1] text-3xl font-bold tracking-wider">
                SHAHRISH
              </h1>
              <p className="text-gray-500 text-xs mt-1">
                ENGINEERING • SURVEYING • CONSTRUCTION INSPECTION
              </p>
            </div>

            {/* Company Contact Info */}
            <div className="text-right text-sm">
              <p className="text-[#0066A1] font-semibold">
                NYC DOB SPECIAL INSPECTION AGENCY# 008524
              </p>
              <div className="mt-1">
                <p>
                  NEW YORK OFFICE: 208 WEST 25TH STREET, SUITE# 603, NEW YORK,
                  NY 10001, T: (646) 797 3518
                </p>
                <p>
                  LONG ISLAND OFFICE: 535 BROADHOLLOW ROAD, SUITE# 87, MELVILLE,
                  NY 11747, T: (631) 393 6020
                </p>
                <p>E: INFO@SHAHRISH.NET | W: WWW.SHAHRISH.NET</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p>
                <span className="font-semibold">Client:</span> {report.client}
              </p>
              <p>
                <span className="font-semibold">Project Site Address:</span>{" "}
                {report.projectSiteAddress}
              </p>
              <p>
                <span className="font-semibold">Project ID:</span>{" "}
                {report.dobJobNumber}
              </p>
              <p>
                <span className="font-semibold">Inspector Name:</span>{" "}
                {report.inspectorName}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Inspection Date:</span>{" "}
                {format(new Date(report.inspectionDate), "MM/dd/yyyy")}
              </p>
              <p>
                <span className="font-semibold">Time In/Out:</span>{" "}
                {report.timeInOut}
              </p>
              <p>
                <span className="font-semibold">Report Number:</span>{" "}
                {report.reportNumber}
              </p>
              <p>
                <span className="font-semibold">Site Weather (°F):</span>{" "}
                {report.siteWeather}
              </p>
            </div>
          </div>

          {/* Report Title */}
          <div className="bg-[#0066A1] text-white text-center py-2 mb-6">
            <h2 className="text-xl font-bold">FIRESTOPPING INSPECTION</h2>
          </div>

          <div className="text-sm mb-6">
            <p className="italic">
              The above referenced project was visited to observe the
              firestopping application for compliance with project drawings,
              specifications, and NYC Building Code requirements.
            </p>
          </div>

          {/* Site Contact */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">SITE CONTACT:</h3>
            <div className="border p-2">{report.siteContact}</div>
          </div>

          {/* Plans Referenced */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">PLANS REFERENCED:</h3>
            <div className="border p-2">{report.plansReferenced}</div>
            <p className="text-sm text-gray-500 mt-1">
              (Plans date, Sealed by, Approved date)
            </p>
          </div>

          {/* Area/Location Inspected */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">AREA/LOCATION INSPECTED:</h3>
            <div className="border p-2">{report.areaInspected}</div>
            <p className="text-sm text-gray-500 mt-1">
              (Floors, Grid Lines, Col btw Fl., Stairs N° btw Fl., etc)
            </p>
          </div>

          {/* Material Used */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              MATERIAL USED/SUBMITTAL APPROVED:
            </h3>
            <div className="border p-2">{report.materialUsed}</div>
          </div>

          {/* Inspection Outcome */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">INSPECTION OUTCOME:</h3>
            <div className="border p-2">
              {report.inspectionOutcome === "CONFORMANCE" && (
                <span className="text-green-600">CONFORMANCE</span>
              )}
              {report.inspectionOutcome === "NON_CONFORMANCE" && (
                <span className="text-red-600">NON-CONFORMANCE</span>
              )}
              {report.inspectionOutcome === "INCOMPLETE" && (
                <span className="text-yellow-600">INCOMPLETE</span>
              )}
            </div>
          </div>

          {/* Non-Conformance Notes */}
          {report.inspectionOutcome === "NON_CONFORMANCE" &&
            report.nonConformanceNotes && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">NON-CONFORMANCE NOTES:</h3>
                <div className="border p-2 whitespace-pre-wrap">
                  {report.nonConformanceNotes}
                </div>
              </div>
            )}

          {/* Checklist */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              CHECKLIST (Please check all applicable):
            </h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Requirements</th>
                  <th className="border p-2 w-16 text-center">YES</th>
                  <th className="border p-2 w-16 text-center">NO</th>
                  <th className="border p-2 w-16 text-center">N/A</th>
                  <th className="border p-2">Inspection Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    a) Is firestopping material used approved?
                  </td>
                  <td className="border p-2 text-center">
                    <div
                      className={`w-4 h-4 mx-auto rounded-full ${
                        report.checklist.firestoppingMaterialApproved.status ===
                        "YES"
                          ? "bg-[#0066A1]"
                          : "bg-white border"
                      }`}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <div
                      className={`w-4 h-4 mx-auto rounded-full ${
                        report.checklist.firestoppingMaterialApproved.status ===
                        "NO"
                          ? "bg-[#0066A1]"
                          : "bg-white border"
                      }`}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <div
                      className={`w-4 h-4 mx-auto rounded-full ${
                        report.checklist.firestoppingMaterialApproved.status ===
                        "N/A"
                          ? "bg-[#0066A1]"
                          : "bg-white border"
                      }`}
                    />
                  </td>
                  <td className="border p-2">
                    {report.checklist.firestoppingMaterialApproved.details}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">
                    b) Are all penetrations or areas that require firestopping
                    sealed properly?
                  </td>
                  <td className="border p-2 text-center">
                    <div
                      className={`w-4 h-4 mx-auto rounded-full ${
                        report.checklist.penetrationsProperlySealed.status ===
                        "YES"
                          ? "bg-[#0066A1]"
                          : "bg-white border"
                      }`}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <div
                      className={`w-4 h-4 mx-auto rounded-full ${
                        report.checklist.penetrationsProperlySealed.status ===
                        "NO"
                          ? "bg-[#0066A1]"
                          : "bg-white border"
                      }`}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <div
                      className={`w-4 h-4 mx-auto rounded-full ${
                        report.checklist.penetrationsProperlySealed.status ===
                        "N/A"
                          ? "bg-[#0066A1]"
                          : "bg-white border"
                      }`}
                    />
                  </td>
                  <td className="border p-2">
                    {report.checklist.penetrationsProperlySealed.details}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Inspection Observations */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              INSPECTION OBSERVATIONS / REMARKS:
            </h3>
            <div className="border p-2 min-h-[100px]">
              {report.inspectionObservations}
            </div>
          </div>

          {/* Inspector's Signature */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">INSPECTOR&apos;S SIGNATURE:</h3>
            <div className="border p-2">{report.inspectorSignature}</div>
          </div>

          {/* Photographs */}
          {report.photographs && report.photographs.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">PHOTOGRAPHS:</h3>
              <div className="grid grid-cols-2 gap-4">
                {report.photographs.map(
                  (photo, index) =>
                    photo.image && (
                      <div key={index} className="border">
                        <div className="aspect-w-4 aspect-h-3">
                          <img
                            src={photo.image}
                            alt={photo.caption}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-2 border-t">
                          <p className="text-sm">
                            Photo {index + 1}: {photo.caption}
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
