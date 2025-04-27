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
            <div className="px-10 mb-6 section avoid-break">
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
