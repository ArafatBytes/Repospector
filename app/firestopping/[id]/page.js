"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";
import Image from "next/image";

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
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReportHeader
          reportId={report._id}
          reportName={`Firestopping Report - ${report.client || "No Client"}`}
          contentId="firestopping-report"
        />

        <div id="firestopping-report" className="bg-white rounded-lg shadow-sm">
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
            Firestopping Report
          </div>

          <div className="p-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-40 section avoid-break">
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

            <div className="text-sm mb-6 mt-6">
              <p className="italic">
                The above referenced project was visited to observe the
                firestopping application for compliance with project drawings,
                specifications, and NYC Building Code requirements.
              </p>
            </div>

            {/* Site Inspector Section */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">SITE CONTACT:</h3>
              <div className="border p-2">{report.siteContact}</div>
            </div>

            {/* Location Map Section */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">PLANS REFERENCED:</h3>
              <div className="border p-2">{report.plansReferenced}</div>
              <p className="text-sm text-gray-500 mt-1">
                (Plans date, Sealed by, Approved date)
              </p>
            </div>

            {/* Building Details Section */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">AREA/LOCATION INSPECTED:</h3>
              <div className="border p-2">{report.areaInspected}</div>
              <p className="text-sm text-gray-500 mt-1">
                (Floors, Grid Lines, Col btw Fl., Stairs N° btw Fl., etc)
              </p>
            </div>

            {/* Material Used */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">
                MATERIAL USED/SUBMITTAL APPROVED:
              </h3>
              <div className="border p-2">{report.materialUsed}</div>
            </div>

            {/* Inspection Outcome */}
            <div className="mt-6 mb-6 section avoid-break">
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
                <div className="mt-6 mb-6 section avoid-break">
                  <h3 className="font-bold mb-2">NON-CONFORMANCE NOTES:</h3>
                  <div className="border p-2 whitespace-pre-wrap">
                    {report.nonConformanceNotes}
                  </div>
                </div>
              )}

            {/* Checklist */}
            <div className="mt-6 mb-6 section avoid-break">
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
                          report.checklist.firestoppingMaterialApproved
                            .status === "YES"
                            ? "bg-[#0066A1]"
                            : "bg-white border"
                        }`}
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <div
                        className={`w-4 h-4 mx-auto rounded-full ${
                          report.checklist.firestoppingMaterialApproved
                            .status === "NO"
                            ? "bg-[#0066A1]"
                            : "bg-white border"
                        }`}
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <div
                        className={`w-4 h-4 mx-auto rounded-full ${
                          report.checklist.firestoppingMaterialApproved
                            .status === "N/A"
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
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">
                INSPECTION OBSERVATIONS / REMARKS:
              </h3>
              <div className="border p-2 min-h-[100px]">
                {report.inspectionObservations}
              </div>
            </div>

            {/* Inspector's Signature */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">INSPECTOR&apos;S SIGNATURE:</h3>
              <div className="border p-2">{report.inspectorSignature}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
