"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";

export default function ViewConcreteReport() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/concrete/${params.id}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
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
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReportHeader
          reportId={report._id}
          reportName={`Concrete Report - ${report.client || "No Client"}`}
          contentId="concrete-report"
        />

        <div id="concrete-report" className="bg-white rounded-lg shadow-sm p-6">
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

          {/* Report Header */}
          <div
            className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-xl font-medium -mx-6 -mt-6 mb-6"
            style={{
              backgroundColor: "#4A90E2 !important",
              color: "white !important",
            }}
          >
            REBAR INSPECTION REPORT
          </div>

          <div className="border-t border-[#0066A1] mb-8" />

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
            <div className="flex items-center">
              <label className="text-sm min-w-24">Client:</label>
              <div className="flex-1 border-b border-gray-300 ml-2">
                {report.client}
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-32">Inspection Date:</label>
              <div className="flex-1 border-b border-gray-300 ml-2">
                {new Date(report.inspectionDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="ml-2">📅</div>
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-24">
                Project Site
                <br />
                Address:
              </label>
              <div className="flex-1 border-b border-gray-300 ml-2">
                {report.projectSiteAddress}
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-32">Time In/Out:</label>
              <div className="flex-1 border-b border-gray-300 ml-2 text-gray-400">
                {report.timeInOut || "e.g., 8:30 am"}
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-24">Project ID:</label>
              <div className="flex-1 border-b border-gray-300 ml-2">
                {report.projectId}
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-32">
                Report
                <br />
                Number:
              </label>
              <div className="flex-1 border-b border-gray-300 ml-2">
                {report.reportNumber}
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-24">
                Inspector
                <br />
                Name:
              </label>
              <div className="flex-1 border-b border-gray-300 ml-2">
                {report.inspectorName}
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-32">
                Site Weather
                <br />
                (°F):
              </label>
              <div className="flex-1 border-b border-gray-300 ml-2 text-gray-400">
                {report.siteWeather || "e.g., 34"}
              </div>
            </div>
          </div>

          <div className="border-t border-[#0066A1] mb-8" />

          {/* Report Title and Description */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-4">
              REBAR INSPECTION REPORT
            </h1>
            <p className="text-sm mb-8">
              The above referenced project was visited to observe the concrete
              installation for compliance with project drawings, specifications,
              and NYC Building Code requirements BC 1704.4
            </p>

            {/* Site Contact */}
            <div className="mb-6">
              <div className="font-bold mb-2">SITE CONTACT:</div>
              <div className="border-b border-gray-300 py-2">
                {report.siteContact}
              </div>
            </div>

            {/* Plans Referenced */}
            <div className="mb-6">
              <div className="font-bold mb-2">
                PLANS REFERENCED:{" "}
                <span className="font-normal text-gray-600">
                  (Plans date, Sealed by, Approved date)
                </span>
              </div>
              <div className="border-b border-gray-300 py-2">
                {report.plansReferenced}
              </div>
            </div>

            {/* Area/Location Inspected */}
            <div className="mb-6">
              <div className="font-bold mb-2">
                AREA/LOCATION INSPECTED:{" "}
                <span className="font-normal text-gray-600">
                  (Floors, Grid Lines, Col btw Fl., Stairs No btw Fl., etc)
                </span>
              </div>
              <div className="border-b border-gray-300 py-2">
                {report.areaInspected}
              </div>
            </div>

            {/* Material Used */}
            <div className="mb-6">
              <div className="font-bold mb-2">
                MATERIAL USED/ SUBMITTAL APPROVED:
              </div>
              <div className="border-b border-gray-300 py-2">
                {report.materialUsed}
              </div>
            </div>

            {/* Inspection Outcome */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                INSPECTION OUTCOME:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={report.inspectionOutcome === "INCOMPLETE"}
                    readOnly
                    className="mr-2"
                  />
                  <span>Incomplete Work: Re-inspection required.</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={report.inspectionOutcome === "CONFORMANCE"}
                    readOnly
                    className="mr-2"
                  />
                  <span>
                    Conformance: Work is in conformance with contract drawings,
                    specifications and NYC BC.
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={report.inspectionOutcome === "NON_CONFORMANCE"}
                    readOnly
                    className="mr-2"
                  />
                  <span>
                    Non-Conformance Work: Deficiencies noted and upon
                    correction, re-inspection required.
                  </span>
                </div>
              </div>
            </div>

            {/* Non-Conformance Notes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Non-Conformance Notes:
              </h3>
              <div className="p-4 border border-gray-300 rounded bg-gray-50">
                {report.nonConformanceNotes || "No notes provided"}
              </div>
            </div>

            {/* Attachments */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <span className="mr-2">📎</span>
                <span className="mr-2">Photographs attached:</span>
                <input
                  type="checkbox"
                  checked={report.hasPhotographs}
                  readOnly
                  className="mr-1"
                />
                <span className="mr-2">Yes</span>
                <input
                  type="checkbox"
                  checked={!report.hasPhotographs}
                  readOnly
                  className="mr-1"
                />
                <span>No</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📋</span>
                <span className="mr-2">Observations/Checklist attached:</span>
                <input
                  type="checkbox"
                  checked={report.hasObservations}
                  readOnly
                  className="mr-1"
                />
                <span className="mr-2">Yes</span>
                <input
                  type="checkbox"
                  checked={!report.hasObservations}
                  readOnly
                  className="mr-1"
                />
                <span>No</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#0066A1] mb-8" />

          {/* Checklist Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              CHECKLIST (Describe all applicable):
            </h3>
            <div className="border border-gray-300">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="border-r border-gray-300 p-2 text-left w-1/3">
                      Requirements
                    </th>
                    <th className="border-r border-gray-300 p-2 text-center w-16">
                      YES
                    </th>
                    <th className="border-r border-gray-300 p-2 text-center w-16">
                      NO
                    </th>
                    <th className="border-r border-gray-300 p-2 text-center w-16">
                      N/A
                    </th>
                    <th className="p-2 text-left">Inspection Details</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      key: "shopDrawings",
                      label: "Shop Drawings are approved and are on-site.",
                    },
                    {
                      key: "gradeOfSteel",
                      label: "Grade of steel delivered as required.",
                    },
                    {
                      key: "spacingCoordinated",
                      label:
                        "Spacing coordinated to suit masonry/concrete units.",
                    },
                    {
                      key: "requiredClearance",
                      label: "Required clearance of steel from forms provided.",
                    },
                    {
                      key: "lengthOfSplices",
                      label:
                        "Length of splices and staggered splices are required.",
                    },
                    {
                      key: "bendsWithinRadii",
                      label:
                        "Bends within radii and tolerance are uniformly made.",
                    },
                    {
                      key: "additionalBars",
                      label:
                        "Additional bars at intersections, openings, and corners provided.",
                    },
                    {
                      key: "barsCleaned",
                      label: "Bars cleaned of material that effect bond.",
                    },
                    {
                      key: "dowelsForMarginal",
                      label: "Dowels for marginal bars at opening.",
                    },
                    {
                      key: "barsTiedAndSupported",
                      label: "Bars tied and supported to avoid displacement.",
                    },
                    {
                      key: "spacersTieWires",
                      label: "Spacers, tie wires, chairs as required.",
                    },
                    {
                      key: "conduitSeparated",
                      label:
                        "Conduit is separated by 3 conduit diameter minimum.",
                    },
                    {
                      key: "noConduitBelow",
                      label:
                        "No conduit or pipe placed below rebar material except where approved.",
                    },
                    {
                      key: "noContactWithMetals",
                      label:
                        "No contact of bars is made with dissimilar metals.",
                    },
                    {
                      key: "barNotNearSurface",
                      label: "Bar not near surface which may cause rusting.",
                    },
                    {
                      key: "adequateClearance",
                      label:
                        "Adequate Clearance provided for deposit of concrete.",
                    },
                    {
                      key: "specialCoating",
                      label: "Special coating as required.",
                    },
                    {
                      key: "noBentBars",
                      label:
                        "No bent bars and tension members installed except where approved.",
                    },
                    {
                      key: "noBoxingOut",
                      label:
                        "Unless approved, boxing out is not approved for subsequent grouting out.",
                    },
                  ].map((item) => (
                    <tr key={item.key} className="border-b border-gray-300">
                      <td className="border-r border-gray-300 p-2">
                        {item.label}
                      </td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          checked={report.checklist[item.key] === "YES"}
                          readOnly
                          className="cursor-default"
                        />
                      </td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          checked={report.checklist[item.key] === "NO"}
                          readOnly
                          className="cursor-default"
                        />
                      </td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          checked={report.checklist[item.key] === "N/A"}
                          readOnly
                          className="cursor-default"
                        />
                      </td>
                      <td className="p-2">
                        {report.checklist[`${item.key}Details`] || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Observations/Remarks */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              INSPECTION OBSERVATIONS / REMARKS:
            </h3>
            <div className="border border-gray-300 rounded-md p-4 min-h-[100px] whitespace-pre-wrap">
              {report.remarks || "No remarks provided"}
            </div>
          </div>

          {/* Photographs */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">PHOTOGRAPHS</h3>
            <div className="grid grid-cols-2 gap-8">
              {report.photographs.map((photo, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-md p-4"
                >
                  <div
                    className="relative w-full"
                    style={{ paddingTop: "75%" }}
                  >
                    {photo.image && (
                      <img
                        src={photo.image}
                        alt={`Photo ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">
                      Photo {index + 1}:
                    </div>
                    <div className="mt-1">
                      {photo.caption || "No caption provided"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
