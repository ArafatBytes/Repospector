"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";
import Image from "next/image";

export default function ViewInsulationReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/insulation/${params.id}`);
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      setReport(data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch report");
      setLoading(false);
    }
  };

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
          reportName={`Insulation Report - ${report.client || "No Client"}`}
          contentId="insulation-report"
        />

        <div id="insulation-report" className="bg-white rounded-lg shadow-sm">
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

          {/* Report Header */}
          <div
            className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-xl font-medium section avoid-break"
            style={{
              backgroundColor: "#4A90E2 !important",
              color: "white !important",
            }}
          >
            Insulation Report
          </div>

          {/* Rest of the report content */}
          <div className="p-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 section avoid-break">
              <div>
                <div className="mb-4">
                  <label className="font-semibold">Client:</label>
                  <div className="mt-1">{report.client}</div>
                </div>
                <div className="mb-4">
                  <label className="font-semibold">Project Site Address:</label>
                  <div className="mt-1">{report.projectSiteAddress}</div>
                </div>
                <div className="mb-4">
                  <label className="font-semibold">Project ID:</label>
                  <div className="mt-1">{report.projectId}</div>
                </div>
                <div className="mb-4">
                  <label className="font-semibold">Inspector Name:</label>
                  <div className="mt-1">{report.inspectorName}</div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label className="font-semibold">Inspection Date:</label>
                  <div className="mt-1">
                    {new Date(report.inspectionDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="font-semibold">Time In/Out:</label>
                  <div className="mt-1">{report.timeInOut}</div>
                </div>
                <div className="mb-4">
                  <label className="font-semibold">Report Number:</label>
                  <div className="mt-1">{report.reportNumber}</div>
                </div>
                <div className="mb-4">
                  <label className="font-semibold">Site Weather (°F):</label>
                  <div className="mt-1">{report.siteWeather}</div>
                </div>
              </div>
            </div>

            <div className="text-sm mb-6 mt-6">
              <p className="italic">
                The above referenced project was visited to observe the
                firestopping application for compliance with project drawings,
                specifications, and NYC Building Code requirements.
              </p>
            </div>

            {/* Site Contact */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">SITE CONTACT:</h3>
              <div className="border p-2">{report.siteContact}</div>
            </div>

            {/* Plans Referenced */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">PLANS REFERENCED:</h3>
              <div className="border p-2">{report.plansReferenced}</div>
            </div>

            {/* Area Inspected */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">AREA/LOCATION INSPECTED:</h3>
              <div className="border p-2">{report.areaInspected}</div>
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
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={report.inspectionOutcome === "INCOMPLETE"}
                    readOnly
                    className="mr-2"
                  />
                  <label>Incomplete Work: Re-inspection required.</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={report.inspectionOutcome === "CONFORMANCE"}
                    readOnly
                    className="mr-2"
                  />
                  <label>
                    Conformance: Work is in conformance with contract drawings,
                    specifications and NYC BC.
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={report.inspectionOutcome === "NON_CONFORMANCE"}
                    readOnly
                    className="mr-2"
                  />
                  <label>
                    Non-Conformance Work: Deficiencies noted and upon
                    correction, re-inspection required.
                  </label>
                </div>
              </div>
            </div>

            {/* Non-Conformance Notes */}
            {report.inspectionOutcome === "NON_CONFORMANCE" && (
              <div className="mt-6 mb-6 section avoid-break">
                <h3 className="font-bold mb-2">NON-CONFORMANCE NOTES:</h3>
                <div className="border p-2 min-h-[100px]">
                  {report.nonConformanceNotes}
                </div>
              </div>
            )}

            {/* Checklist */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">
                CHECKLIST (Please check all applicable):
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Requirements</th>
                    <th className="border p-2 w-20 text-center">YES</th>
                    <th className="border p-2 w-20 text-center">NO</th>
                    <th className="border p-2 w-20 text-center">N/A</th>
                    <th className="border p-2">Inspection Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">
                      a) Verify certificate of compliance for insulation
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyCertificateOfCompliance
                            .status === "YES"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyCertificateOfCompliance
                            .status === "NO"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyCertificateOfCompliance
                            .status === "N/A"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2">
                      {report.checklist.verifyCertificateOfCompliance.details}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">
                      b) Verify insulation is installed in compliance with
                      approved documents and manufacturer&apos;s guidelines
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyInsulationInstalled.status ===
                          "YES"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyInsulationInstalled.status ===
                          "NO"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyInsulationInstalled.status ===
                          "N/A"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2">
                      {report.checklist.verifyInsulationInstalled.details}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">
                      c) Verify R-value is visible and identifiable on each
                      piece of insulation
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyRValueVisible.status === "YES"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyRValueVisible.status === "NO"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="radio"
                        checked={
                          report.checklist.verifyRValueVisible.status === "N/A"
                        }
                        readOnly
                      />
                    </td>
                    <td className="border p-2">
                      {report.checklist.verifyRValueVisible.details}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Inspection Observations */}
            <div className="mt-6 mb-6 section avoid-break">
              <h3 className="font-bold mb-2">
                INSPECTION OBSERVATIONS/REMARKS:
              </h3>
              <div className="border p-2">{report.inspectionObservations}</div>
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
