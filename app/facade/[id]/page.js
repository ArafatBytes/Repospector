"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";

export default function ViewFacadeReport() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/facade/${params.id}`);
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
    return <div className="text-center mt-8">Loading report...</div>;
  }

  if (!report) {
    return <div className="text-center mt-8">Report not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ReportHeader
        reportId={params.id}
        reportName="Facade Inspection Report"
        contentId="facade-report"
        backUrl="/dashboard"
      />

      <div id="facade-report" className="bg-white rounded-lg shadow-sm">
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
          className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-2xl font-medium section avoid-break"
          style={{
            backgroundColor: "#4A90E2 !important",
            color: "white !important",
          }}
        >
          Facade Inspection Report
        </div>

        <div className="p-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 section avoid-break">
            <div>
              <label className="font-bold block mb-2">PROJECT NAME:</label>
              <div className="border-b border-gray-300 py-1">
                {report.projectName}
              </div>
            </div>
            <div>
              <label className="font-bold block mb-2">PROJECT ADDRESS:</label>
              <div className="border-b border-gray-300 py-1">
                {report.projectAddress}
              </div>
            </div>
            <div>
              <label className="font-bold block mb-2">CLIENT:</label>
              <div className="border-b border-gray-300 py-1">
                {report.client}
              </div>
            </div>
            <div>
              <label className="font-bold block mb-2">DATE:</label>
              <div className="border-b border-gray-300 py-1">
                {new Date(report.date).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Site Inspector Section */}
          <div className="mb-6 section avoid-break">
            <div className="flex flex-col items-center gap-6">
              <div className="w-full max-w-md mt-8">
                <label className="font-bold block mb-2 text-center text-xl">
                  Site Inspector:
                </label>
                <div className="text-center border-b border-gray-300 py-1">
                  {report.siteInspector}
                </div>
              </div>
              {report.inspectorImage ? (
                <div className="flex flex-col items-center w-full photo-container avoid-break scale-down-on-break">
                  <img
                    src={report.inspectorImage}
                    alt="Site Inspector"
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
                </div>
              ) : (
                <div className="w-full flex items-center justify-center bg-gray-100 text-gray-400 h-64 rounded-md">
                  No Inspector Image
                </div>
              )}
            </div>
          </div>

          {/* Location Map Section */}
          <div className="flex flex-col items-center mb-8 section avoid-break">
            {/* ... existing location map content ... */}
          </div>

          {/* Building Details Section */}
          <div className="mb-10 section avoid-break">
            <h2 className="text-xl font-bold text-center mb-6">
              Building Details:
            </h2>

            {/* Property Information */}
            <div className="mb-8">
              <h3 className="font-bold mb-4">Property Information</h3>
              <div className="grid grid-cols-[200px,1fr] gap-y-4 items-center">
                <label className="font-normal">Address:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.buildingAddress}
                </div>

                <label className="font-normal">Block No.:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.blockNo}
                </div>

                <label className="font-normal">Lot No.:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.lotNo}
                </div>

                <label className="font-normal">BIN:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.bin}
                </div>

                <label className="font-normal">Landmark Status:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.landmarkStatus}
                </div>

                <label className="font-normal">Community Board:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.communityBoard}
                </div>
              </div>
            </div>

            {/* Building Description */}
            <div>
              <h3 className="font-bold mb-4">Building Description</h3>
              <div className="grid grid-cols-[200px,1fr] gap-y-4 items-center">
                <label className="font-normal">Number of stories:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.numberOfStories}
                </div>

                <label className="font-normal">Lot Size:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.lotSize}
                </div>

                <label className="font-normal">Gross Floor Area:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.grossFloorArea}
                </div>

                <label className="font-normal">Usage:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.usage}
                </div>

                <label className="font-normal">Zoning:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.zoning}
                </div>

                <label className="font-normal">Zoning Map #:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.zoningMapNo}
                </div>

                <label className="font-normal">Year built:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.yearBuilt}
                </div>

                <label className="font-normal">Construction:</label>
                <div className="border-b border-gray-300 py-1">
                  {report.construction}
                </div>
              </div>
            </div>
          </div>

          {/* Parking Structure Overlay Section */}
          <div className="flex flex-col items-center mb-10 section avoid-break">
            {/* ... existing parking structure content ... */}
          </div>

          {/* Report on Parking Structure Section */}
          <div className="px-10 mb-10 section avoid-break">
            {/* ... existing report structure content ... */}
          </div>

          {/* Structural Design Section */}
          <div className="mb-6 section avoid-break">
            <h2 className="text-xl font-bold mb-6">STRUCTURAL DESIGN</h2>
            <div className="space-y-8">
              {report.structuralDesignImages &&
              report.structuralDesignImages.length > 0 ? (
                report.structuralDesignImages.map((image, index) => (
                  <div
                    key={image.id || index}
                    className="border border-gray-200 rounded-lg p-6 photo-container avoid-break scale-down-on-break flex flex-col items-center"
                  >
                    {image.file ? (
                      <img
                        src={image.file}
                        alt={
                          image.description ||
                          `Structural design image ${index + 1}`
                        }
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
                    <div className="mt-4 text-center text-sm text-gray-700">
                      {image.description || `Image ${index + 1}`}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center">
                  No structural design images uploaded
                </div>
              )}
            </div>
          </div>

          {/* Observations Section */}
          <div className="mb-6 section avoid-break">
            <h2 className="text-xl font-bold mb-6">OBSERVATIONS</h2>
            <div className="space-y-6">
              {report.observations && report.observations.length > 0 ? (
                report.observations.map((observation, index) => (
                  <div
                    key={observation.id || index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start mb-2">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <span>{observation.text}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center">
                  No observations added
                </div>
              )}
            </div>
          </div>

          {/* Photographs Section */}
          <div className="mb-6 section avoid-break">
            <h2 className="text-xl font-bold mb-6">PHOTOGRAPHS</h2>
            <div className="space-y-8">
              {report.images && report.images.length > 0 ? (
                report.images.map((image, index) => (
                  <div
                    key={image.id || index}
                    className="border border-gray-200 rounded-lg p-6 photo-container avoid-break scale-down-on-break flex flex-col items-center"
                  >
                    {image.file ? (
                      <img
                        src={image.file}
                        alt={image.description || `Report image ${index + 1}`}
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
                    <div className="mt-4 text-center text-sm text-gray-700">
                      {image.description || `Image ${index + 1}`}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center">
                  No photographs uploaded
                </div>
              )}
            </div>
          </div>

          {/* Recommendations and Remarks Section */}
          <div className="px-10 mb-10 section avoid-break">
            {/* ... existing remarks content ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
