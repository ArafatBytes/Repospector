"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { ReportHeader } from "../../utils/addPrintButton";

export default function ViewAirBalancingReport() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/air-balancing/${params.id}`);
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
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!report) {
    return <div className="text-center py-8">Report not found</div>;
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Dashboard Link */}
        <ReportHeader
          reportId={report._id}
          reportName={`Air Balancing Report - ${report.client || "No Client"}`}
          contentId="air-balancing-report"
        />

        <div
          id="air-balancing-report"
          className="bg-white rounded-lg shadow-sm p-6"
        >
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
            Air Balancing Report
          </div>

          {/* Report Content */}
          <div className="space-y-8">
            {/* Basic Info Section */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <div className="mb-4">
                  <span className="text-sm font-medium">Client:</span>
                  <p className="mt-1">{report.client}</p>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium">
                    Project Site Address:
                  </span>
                  <p className="mt-1">{report.projectSiteAddress}</p>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium">Project ID:</span>
                  <p className="mt-1">{report.projectId}</p>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium">Inspector Name:</span>
                  <p className="mt-1">{report.inspectorName}</p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <span className="text-sm font-medium">Inspection Date:</span>
                  <p className="mt-1">
                    {format(new Date(report.inspectionDate), "MM/dd/yyyy")}
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium">Time In/Out:</span>
                  <p className="mt-1">{report.timeInOut}</p>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium">Report Number:</span>
                  <p className="mt-1">{report.reportNumber}</p>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium">
                    Site Weather (°F):
                  </span>
                  <p className="mt-1">{report.siteWeather}</p>
                </div>
              </div>
            </div>

            {/* Blue divider */}
            <div className="h-0.5 bg-[#0066A1] my-8"></div>

            {/* HVAC Unit Details Section */}
            <div className="border border-gray-300">
              {/* Unit Details Row */}
              <div className="grid grid-cols-4 border-b border-gray-300">
                <div className="p-4 border-r border-gray-300">
                  <div className="text-xs font-bold mb-1">UNIT NO.</div>
                  <div>{report.unitNo}</div>
                </div>
                <div className="p-4 border-r border-gray-300">
                  <div className="text-xs font-bold mb-1">TYPE & SIZE</div>
                  <div>{report.typeAndSize}</div>
                </div>
                <div className="p-4 border-r border-gray-300">
                  <div className="text-xs font-bold mb-1">MANUFACTURER</div>
                  <div>{report.manufacturer}</div>
                </div>
                <div className="p-4">
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={report.directDrive}
                        readOnly
                        className="form-checkbox text-[#0066A1]"
                      />
                      <span className="ml-2 text-sm">DIRECT DRIVE</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={report.vBeltDrive}
                        readOnly
                        className="form-checkbox text-[#0066A1]"
                      />
                      <span className="ml-2 text-sm">V-BELT DRIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fan Details Row */}
              <div className="border-b border-gray-300">
                <div className="p-4">
                  <div className="text-xs font-bold mb-2 text-center">FAN</div>
                  <div className="grid grid-cols-4">
                    <div className="text-center border-r border-gray-300">
                      <div className="text-xs font-bold mb-1">CFM</div>
                      <div>{report.fanCfmRated}</div>
                    </div>
                    <div className="text-center border-r border-gray-300">
                      <div className="text-xs font-bold mb-1">SP</div>
                      <div>{report.fanSpRated}</div>
                    </div>
                    <div className="text-center border-r border-gray-300">
                      <div className="text-xs font-bold mb-1">RPM</div>
                      <div>{report.fanRpmRated}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold mb-1">AMPS</div>
                      <div>{report.fanAmpsRated}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motor Details Row */}
              <div className="border-b border-gray-300">
                <div className="p-4">
                  <div className="text-xs font-bold mb-2 text-center">
                    MOTOR
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="text-center border-r border-gray-300">
                      <div className="text-xs font-bold mb-1">VOLTS</div>
                      <div>{report.motorVolts}</div>
                    </div>
                    <div className="text-center border-r border-gray-300">
                      <div className="text-xs font-bold mb-1">RPM</div>
                      <div>{report.motorRpm}</div>
                    </div>
                    <div className="text-center border-r border-gray-300">
                      <div className="text-xs font-bold mb-1">HP</div>
                      <div>{report.motorHp}</div>
                    </div>
                    <div className="text-center">
                      {/* Empty cell for alignment */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Duct System Row */}
              <div className="grid grid-cols-2">
                <div className="p-4 border-r border-gray-300">
                  <div>
                    <span className="text-xs font-bold">AREA SERVED:</span>
                    <span className="ml-2">{report.areaServed}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-bold">INSTRUMENTS:</span>
                    <span className="ml-2">{report.instruments}</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-end space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={report.supply}
                      readOnly
                      className="form-checkbox text-[#0066A1]"
                    />
                    <span className="ml-2 text-sm">SUPPLY</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={report.return}
                      readOnly
                      className="form-checkbox text-[#0066A1]"
                    />
                    <span className="ml-2 text-sm">RETURN</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={report.exhaust}
                      readOnly
                      className="form-checkbox text-[#0066A1]"
                    />
                    <span className="ml-2 text-sm">EXHAUST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Measurements Table */}
            <div className="mt-8">
              <div className="border border-gray-300">
                {/* Table Header */}
                <div className="grid grid-cols-8 border-b border-gray-300 bg-gray-50">
                  <div className="p-2 text-xs font-bold text-center border-r border-gray-300">
                    FLOOR NO.
                  </div>
                  <div className="p-2 text-xs font-bold text-center border-r border-gray-300">
                    TYPE OF OUTLET
                  </div>
                  <div className="p-2 text-xs font-bold text-center border-r border-gray-300">
                    SIZE IN.
                  </div>
                  <div className="p-2 text-xs font-bold text-center border-r border-gray-300">
                    AREA FT²
                  </div>
                  <div className="p-2 text-xs font-bold text-center border-r border-gray-300">
                    VEL FPM
                  </div>
                  <div className="p-2 text-xs font-bold text-center border-r border-gray-300">
                    ACTUAL CFM
                  </div>
                  <div className="p-2 text-xs font-bold text-center border-r border-gray-300">
                    REQ&apos;D CFM
                  </div>
                  <div className="p-2 text-xs font-bold text-center">
                    REMARKS
                  </div>
                </div>

                {/* Table Body */}
                {report.measurements.map((measurement, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-8 border-b border-gray-300"
                  >
                    <div className="p-2 border-r border-gray-300">
                      {measurement.floorNo}
                    </div>
                    <div className="p-2 border-r border-gray-300">
                      {measurement.typeOfOutlet}
                    </div>
                    <div className="p-2 border-r border-gray-300">
                      {measurement.sizeIn}
                    </div>
                    <div className="p-2 border-r border-gray-300">
                      {measurement.areaFt}
                    </div>
                    <div className="p-2 border-r border-gray-300">
                      {measurement.velFpm}
                    </div>
                    <div className="p-2 border-r border-gray-300">
                      {measurement.actualCfm}
                    </div>
                    <div className="p-2 border-r border-gray-300">
                      {measurement.reqCfm}
                    </div>
                    <div className="p-2">{measurement.remarks}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            {report.photos && report.photos.length > 0 && (
              <div className="mt-8 print-break-before photos-section">
                <h2 className="text-lg font-semibold mb-4">Photos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 p-4 rounded-md photo-container"
                    >
                      <div className="relative">
                        <img
                          src={photo.image}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                      {photo.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        {/* ... existing code ... */}
      </div>
    </div>
  );
}
