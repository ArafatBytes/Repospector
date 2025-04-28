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

        <div id="concrete-report" className="bg-white rounded-lg shadow-sm">
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
            Concrete Report
          </div>

          <div className="p-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 section avoid-break">
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

            {/* Site Inspector Section */}
            <div className=" mb-6 section avoid-break">
              {/* Description Text */}
              <div className="text-sm mb-8 mt-8">
                The above referenced project was visited to observe the concrete
                installation for compliance with project drawings,
                specifications, and NYC Building Code requirements BC 1704.4
              </div>
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
                      Conformance: Work is in conformance with contract
                      drawings, specifications and NYC BC.
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

              {/* Checklist Table */}
              <div className="mb-8 mt-8">
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
                          label:
                            "Required clearance of steel from forms provided.",
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
                          label:
                            "Bars tied and supported to avoid displacement.",
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
                          label:
                            "Bar not near surface which may cause rusting.",
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
                              name={item.key}
                              value="YES"
                              checked={report.checklist?.[item.key] === "YES"}
                              readOnly
                            />
                          </td>
                          <td className="border-r border-gray-300 p-2 text-center">
                            <input
                              type="radio"
                              name={item.key}
                              value="NO"
                              checked={report.checklist?.[item.key] === "NO"}
                              readOnly
                            />
                          </td>
                          <td className="border-r border-gray-300 p-2 text-center">
                            <input
                              type="radio"
                              name={item.key}
                              value="N/A"
                              checked={report.checklist?.[item.key] === "N/A"}
                              readOnly
                            />
                          </td>
                          <td className="p-2">
                            {report.checklist?.[`${item.key}Details`] || ""}
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
                <div className="w-full border border-gray-300 rounded-md p-4 min-h-[100px]">
                  {report.remarks || "No observations or remarks provided."}
                </div>
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

            {/* Location Map Section */}
            <div className="flex flex-col items-center mb-8 section avoid-break">
              {/* ... existing location map content ... */}
            </div>

            {/* Building Details Section */}
            <div className="px-10 mb-10 section avoid-break">
              {/* ... existing building details content ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
