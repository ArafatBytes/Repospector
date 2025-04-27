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
          className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-xl font-medium section avoid-break"
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
          <div className="px-10 mb-6 section avoid-break">
            <div className="flex flex-col items-center gap-6">
              <div className="w-full max-w-md">
                <label className="font-bold block mb-2 text-center">
                  Site Inspector:
                </label>
                <div className="text-center border-b border-gray-300 py-1">
                  {report.siteInspector}
                </div>
              </div>
              {report.inspectorImage && (
                <div className="flex flex-col items-center">
                  <Image
                    src={report.inspectorImage}
                    alt="Site Inspector"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto h-auto max-w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Location Map Section */}
          <div className="flex flex-col items-center mb-8 section avoid-break">
            {/* ... existing location map content ... */}
          </div>

          {/* Building Details Section */}
          <div className="px-10 mb-10 section avoid-break">
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
  );
}
