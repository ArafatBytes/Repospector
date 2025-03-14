"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";

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
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard Link */}
        <ReportHeader
          reportId={report._id}
          reportName={`Insulation Report - ${report.client || "No Client"}`}
          contentId="insulation-report"
        />

        <div
          id="insulation-report"
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
            Insulation Report
          </div>

          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            {/* Company Info - Left */}
            <div>
              <h1 className="text-[#0066A1] text-2xl font-bold mb-1">
                SHAHRISH
              </h1>
              <div className="text-sm">
                <p>ENGINEERING · SURVEYING · CONSTRUCTION</p>
                <p>INSPECTION</p>
              </div>
            </div>

            {/* Company Details - Right */}
            <div className="text-sm text-right">
              <p className="text-[#0066A1] mb-2">
                NYC DOB SPECIAL INSPECTION AGENCY# 008524
              </p>
              <p>
                NEW YORK OFFICE: 208 WEST 25TH STREET, SUITE# 603, NEW YORK, NY
                10001, T: (646) 797 5518
              </p>
              <p>
                LONG ISLAND OFFICE: 535 BROADHOLLOW ROAD, SUITE# 87, MELVILLE,
                NY 11747, T: (631) 393 6020
              </p>
              <p>E: INFO@SHAHRISH.NET | W: WWW.SHAHRISH.NET</p>
            </div>
          </div>

          {/* Rest of the report content */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Report Title */}
            <div className="bg-[#0066A1] text-white text-center py-2">
              <h2 className="text-xl font-bold">INSULATION INSPECTION</h2>
            </div>

            {/* Site Contact */}
            <div>
              <h3 className="font-bold mb-2">SITE CONTACT:</h3>
              <div className="border p-2">{report.siteContact}</div>
            </div>

            {/* Plans Referenced */}
            <div>
              <h3 className="font-bold mb-2">PLANS REFERENCED:</h3>
              <div className="border p-2">{report.plansReferenced}</div>
            </div>

            {/* Area Inspected */}
            <div>
              <h3 className="font-bold mb-2">AREA/LOCATION INSPECTED:</h3>
              <div className="border p-2">{report.areaInspected}</div>
            </div>

            {/* Material Used */}
            <div>
              <h3 className="font-bold mb-2">
                MATERIAL USED/SUBMITTAL APPROVED:
              </h3>
              <div className="border p-2">{report.materialUsed}</div>
            </div>

            {/* Inspection Outcome */}
            <div className="mb-6">
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
              <div className="mb-6">
                <h3 className="font-bold mb-2">NON-CONFORMANCE NOTES:</h3>
                <div className="border p-2 min-h-[100px]">
                  {report.nonConformanceNotes}
                </div>
              </div>
            )}

            {/* Checklist */}
            <div className="mb-6">
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
            <div>
              <h3 className="font-bold mb-2">
                INSPECTION OBSERVATIONS/REMARKS:
              </h3>
              <div className="border p-2">{report.inspectionObservations}</div>
            </div>

            {/* Inspector's Signature */}
            <div>
              <h3 className="font-bold mb-2">INSPECTOR&apos;S SIGNATURE:</h3>
              <div className="border p-2">{report.inspectorSignature}</div>
            </div>

            {/* Photographs */}
            {report.hasPhotographs && report.photographs.length > 0 && (
              <div className="print:break-before-page">
                <h3 className="font-bold mb-2">PHOTOGRAPHS:</h3>
                <div className="grid grid-cols-2 gap-4 print:gap-8">
                  {report.photographs.map((photo, index) => (
                    <div
                      key={index}
                      className="border p-2 print:break-inside-avoid"
                    >
                      <div className="relative aspect-[4/3]">
                        <img
                          src={photo.image}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-contain print:object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Photo {index + 1}: {photo.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
