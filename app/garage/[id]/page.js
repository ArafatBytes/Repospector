"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";

export default function ViewGarageReport() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/garage/${params.id}`);
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
        reportName="Garage Inspection Report"
        contentId="garage-report"
        backUrl="/dashboard"
      />
      <div id="garage-report" className="bg-white rounded-lg shadow-sm">
        {/* Header with Logo and Address */}
        <div className="flex justify-between items-start p-6 border-b section avoid-break">
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
          <div className="text-right text-sm">
            <p>
              <strong>NYC DOB SIA# 008524</strong>
            </p>
            <p>15 WEST 38TH STREET, 8TH FLOOR (SUITE 808)</p>
            <p>NEW YORK, NEW YORK 10018</p>
            <p>T: (212) 632-8430</p>
          </div>
        </div>

        <div
          className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-xl font-medium section avoid-break"
          style={{
            backgroundColor: "#4A90E2 !important",
            color: "white !important",
          }}
        >
          GARAGE INSPECTION REPORT
        </div>

        <div className="p-6">
          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 section avoid-break">
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

          {/* ATTN Section */}
          <div className="px-10 mb-6 section avoid-break">
            <h3 className="font-bold mb-2">ATTN</h3>
            <div className="mb-2">{report.attnName}</div>
            <div className="mb-2">{report.attnCompany}</div>
            <div className="mb-2">{report.attnAddress}</div>
            <div>{report.attnEmail}</div>
          </div>

          {/* RE Section */}
          <div className="px-10 mb-6 section avoid-break">
            <h3 className="font-bold mb-2">RE</h3>
            <div>{report.re}</div>
          </div>

          {/* Application Body Section */}
          <div className="px-10 mb-6 section avoid-break">
            <h3 className="font-bold mb-2">Application Body</h3>
            <div className="whitespace-pre-line">{report.applicationBody}</div>
          </div>

          {/* Location Map Section */}
          <div className="flex flex-col items-center mb-8 section avoid-break">
            <h2 className="text-2xl font-bold underline mb-4 text-center">
              Location Map:
            </h2>
            {report.locationMap && (
              <div className="flex flex-col items-center">
                <Image
                  src={report.locationMap}
                  alt="Location Map"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-auto max-w-full"
                />
              </div>
            )}
          </div>

          {/* Building Details Section */}
          <div className="px-10 mb-10 section avoid-break">
            <h2 className="text-3xl font-extrabold underline text-center mb-8 mt-8 tracking-wide">
              BUILDING DETAILS
            </h2>
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-left">
                Property Information
              </h3>
              <div className="grid grid-cols-[220px,1fr] gap-y-4 items-center">
                <label className="font-medium">Address:</label>
                <div>{report.buildingAddress}</div>
                <label className="font-medium">Block No.:</label>
                <div>{report.blockNo}</div>
                <label className="font-medium">Lot No.:</label>
                <div>{report.lotNo}</div>
                <label className="font-medium">BIN:</label>
                <div>{report.bin}</div>
                <label className="font-medium">Landmark Status:</label>
                <div>{report.landmarkStatus}</div>
                <label className="font-medium">Community Board:</label>
                <div>{report.communityBoard}</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-left">
                Building Description
              </h3>
              <div className="grid grid-cols-[220px,1fr] gap-y-4 items-center">
                <label className="font-medium">Number of stories:</label>
                <div>{report.numberOfStories}</div>
                <label className="font-medium">Lot Size:</label>
                <div>{report.lotSize}</div>
                <label className="font-medium">Gross Floor Area:</label>
                <div>{report.grossFloorArea}</div>
                <label className="font-medium">Usage:</label>
                <div>{report.usage}</div>
                <label className="font-medium">Zoning:</label>
                <div>{report.zoning}</div>
                <label className="font-medium">Zoning Map #:</label>
                <div>{report.zoningMapNo}</div>
                <label className="font-medium">Year built:</label>
                <div>{report.yearBuilt}</div>
                <label className="font-medium">Construction:</label>
                <div>{report.construction}</div>
              </div>
            </div>
          </div>

          {/* Parking Structure Overlay Section */}
          <div className="flex flex-col items-center mb-10 section avoid-break">
            <h2 className="text-2xl font-bold underline mb-4 text-center">
              PARKING STRUCTURE OVERLAY
            </h2>
            {report.parkingOverlayImages &&
              report.parkingOverlayImages.length === 0 && (
                <div className="text-gray-500">No images uploaded</div>
              )}
            {report.parkingOverlayImages &&
              report.parkingOverlayImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center mb-6 w-full"
                >
                  <Image
                    src={img}
                    alt={`Parking Overlay ${idx + 1}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto h-auto max-w-full"
                  />
                </div>
              ))}
          </div>

          {/* Report on Parking Structure Section */}
          <div className="px-10 mb-10 section avoid-break">
            <h2 className="text-3xl font-extrabold underline text-center mb-8 mt-8 tracking-wide">
              REPORT ON PARKING STRUCTURE:
            </h2>
            <div className="space-y-8">
              {report.reportStructureAnswers &&
                report.reportStructureAnswers.length > 0 &&
                [
                  "Was a comprehensive inspection of the entire parking structure conducted, including structural components, waterproofing systems, fireproofing and fire-stopping systems, and wearing surfaces, as well as areas directly above or below the structure?",
                  "Was a physical assessment performed for the purpose of this initial observation report?",
                  "Were any SREM (Significant Repairs and Emergency Maintenance) conditions identified?",
                  "If SREM conditions were found, is it likely they will become unsafe before the next compliance report is due?",
                  "Were any unsafe conditions identified?",
                  "Was the Department of Buildings and the building owner notified of any unsafe conditions?",
                  "Were public safety measures required?",
                  "Were public safety measures implemented?",
                ].map((question, idx) => (
                  <div key={idx}>
                    <div className={idx === 7 ? "font-medium" : "font-medium"}>
                      {question}
                    </div>
                    <div
                      className={
                        idx === 7 ? "mt-2 font-bold" : "mt-2 font-bold"
                      }
                    >
                      {report.reportStructureAnswers[idx]}
                    </div>
                  </div>
                ))}
            </div>
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
            <h2 className="text-2xl font-bold mb-6 text-center">
              RECOMMENDATIONS AND REMARKS
            </h2>
            <div className="space-y-6">
              {report.remarks && report.remarks.length === 0 && (
                <div className="text-gray-500">No remarks added</div>
              )}
              {report.remarks &&
                report.remarks.map((remark, index) => (
                  <div
                    key={remark.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold">{index + 1}.</span>
                    </div>
                    <div className="whitespace-pre-line">{remark.text}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
