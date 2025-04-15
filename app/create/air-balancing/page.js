"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function AirBalancingReport() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    client: "",
    inspectionDate: format(new Date(), "yyyy-MM-dd"),
    projectSiteAddress: "",
    projectId: "",
    inspectorName: "",
    timeInOut: "",
    reportNumber: "",
    siteWeather: "",
    // HVAC Unit Details
    unitNo: "",
    typeAndSize: "",
    manufacturer: "",
    directDrive: false,
    vBeltDrive: false,
    // Fan Details
    fanCfmRated: "",
    fanSpRated: "",
    fanRpmRated: "",
    fanAmpsRated: "",
    // Motor Details
    motorVolts: "",
    motorRpm: "",
    motorHp: "",
    // Duct System Details
    areaServed: "",
    instruments: "",
    supply: false,
    return: false,
    exhaust: false,
    // Measurement Table
    measurements: [
      {
        floorNo: "1",
        typeOfOutlet: "",
        sizeIn: "",
        areaFt: "",
        velFpm: "",
        actualCfm: "",
        reqCfm: "",
        remarks: "",
      },
    ],
  });

  const handleAddLine = () => {
    setFormData((prev) => ({
      ...prev,
      measurements: [
        ...prev.measurements,
        {
          floorNo: "",
          typeOfOutlet: "",
          sizeIn: "",
          areaFt: "",
          velFpm: "",
          actualCfm: "",
          reqCfm: "",
          remarks: "",
        },
      ],
    }));
  };

  const handleMeasurementChange = (index, field, value) => {
    const newMeasurements = [...formData.measurements];
    newMeasurements[index] = {
      ...newMeasurements[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      measurements: newMeasurements,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/air-balancing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      const data = await response.json();
      toast.success("Report submitted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard Button */}
        <div className="flex justify-end mb-4">
          <Link
            href="/dashboard"
            className="flex items-center text-[#4A90E2] hover:text-[#357ABD] transition-colors"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Header with Logo and Address */}
          <div className="flex justify-between items-start p-6 border-b">
            {/* Logo on the left */}
            <div>
              <Image
                src="/images/logo.jpg"
                alt="SHAHRISH"
                width={300}
                height={100}
                priority
              />
            </div>
            {/* Company Address on the right */}
            <div className="text-right text-sm">
              <p>15 WEST 38TH STREET, 8TH FLOOR (SUITE 808)</p>
              <p>NEW YORK, NEW YORK 10018</p>
              <p>T: (212) 632-8430</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {/* Left Column */}
            <div>
              <div className="flex items-center mb-4">
                <label className="w-24 text-sm">Client:</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-24 text-sm">Project Site Address:</label>
                <input
                  type="text"
                  value={formData.projectSiteAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      projectSiteAddress: e.target.value,
                    })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-24 text-sm">Project ID:</label>
                <input
                  type="text"
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-24 text-sm">Inspector Name:</label>
                <input
                  type="text"
                  value={formData.inspectorName}
                  onChange={(e) =>
                    setFormData({ ...formData, inspectorName: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="flex items-center mb-4">
                <label className="w-24 text-sm">Inspection Date:</label>
                <input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, inspectionDate: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-24 text-sm">Time In/Out:</label>
                <input
                  type="text"
                  value={formData.timeInOut}
                  onChange={(e) =>
                    setFormData({ ...formData, timeInOut: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                  placeholder="e.g., 8:30 am"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-24 text-sm">Report Number:</label>
                <input
                  type="text"
                  value={formData.reportNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, reportNumber: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-24 text-sm">Site Weather (°F):</label>
                <input
                  type="text"
                  value={formData.siteWeather}
                  onChange={(e) =>
                    setFormData({ ...formData, siteWeather: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                  placeholder="e.g., 34"
                />
              </div>
            </div>
          </div>

          {/* Blue divider */}
          <div className="h-0.5 bg-[#0066A1] my-8"></div>

          {/* HVAC Unit Details Section */}
          <div className="border border-gray-300">
            {/* Unit Details Row */}
            <div className="grid grid-cols-4 border-b border-gray-300">
              <div className="p-2 border-r border-gray-300">
                <div className="text-xs font-bold mb-1">UNIT NO.</div>
                <input
                  type="text"
                  value={formData.unitNo}
                  onChange={(e) =>
                    setFormData({ ...formData, unitNo: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <div className="p-2 border-r border-gray-300">
                <div className="text-xs font-bold mb-1">TYPE & SIZE</div>
                <input
                  type="text"
                  value={formData.typeAndSize}
                  onChange={(e) =>
                    setFormData({ ...formData, typeAndSize: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <div className="p-2 border-r border-gray-300">
                <div className="text-xs font-bold mb-1">MANUFACTURER</div>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <div className="p-2 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.directDrive}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        directDrive: e.target.checked,
                      })
                    }
                    className="form-checkbox text-[#0066A1]"
                  />
                  <span className="text-sm">DIRECT DRIVE</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.vBeltDrive}
                    onChange={(e) =>
                      setFormData({ ...formData, vBeltDrive: e.target.checked })
                    }
                    className="form-checkbox text-[#0066A1]"
                  />
                  <span className="text-sm">V-BELT DRIVE</span>
                </label>
              </div>
            </div>

            {/* Fan Details Row */}
            <div className="grid grid-cols-1 border-b border-gray-300">
              <div className="p-2">
                <div className="text-xs font-bold mb-2 text-center">FAN</div>
                <div className="grid grid-cols-4">
                  <div className="text-center border-r border-gray-300">
                    <div className="text-xs font-bold mb-1">CFM</div>
                    <input
                      type="text"
                      value={formData.fanCfmRated}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fanCfmRated: e.target.value,
                        })
                      }
                      className="w-full bg-transparent outline-none text-sm text-center"
                    />
                  </div>
                  <div className="text-center border-r border-gray-300">
                    <div className="text-xs font-bold mb-1">SP</div>
                    <input
                      type="text"
                      value={formData.fanSpRated}
                      onChange={(e) =>
                        setFormData({ ...formData, fanSpRated: e.target.value })
                      }
                      className="w-full bg-transparent outline-none text-sm text-center"
                    />
                  </div>
                  <div className="text-center border-r border-gray-300">
                    <div className="text-xs font-bold mb-1">RPM</div>
                    <input
                      type="text"
                      value={formData.fanRpmRated}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fanRpmRated: e.target.value,
                        })
                      }
                      className="w-full bg-transparent outline-none text-sm text-center"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold mb-1">AMPS</div>
                    <input
                      type="text"
                      value={formData.fanAmpsRated}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fanAmpsRated: e.target.value,
                        })
                      }
                      className="w-full bg-transparent outline-none text-sm text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Motor Details Row */}
            <div className="grid grid-cols-1 border-b border-gray-300">
              <div className="p-2">
                <div className="text-xs font-bold mb-2 text-center">MOTOR</div>
                <div className="grid grid-cols-4">
                  <div className="text-center border-r border-gray-300">
                    <div className="text-xs font-bold mb-1">VOLTS</div>
                    <input
                      type="text"
                      value={formData.motorVolts}
                      onChange={(e) =>
                        setFormData({ ...formData, motorVolts: e.target.value })
                      }
                      className="w-full bg-transparent outline-none text-sm text-center"
                    />
                  </div>
                  <div className="text-center border-r border-gray-300">
                    <div className="text-xs font-bold mb-1">RPM</div>
                    <input
                      type="text"
                      value={formData.motorRpm}
                      onChange={(e) =>
                        setFormData({ ...formData, motorRpm: e.target.value })
                      }
                      className="w-full bg-transparent outline-none text-sm text-center"
                    />
                  </div>
                  <div className="text-center border-r border-gray-300">
                    <div className="text-xs font-bold mb-1">HP</div>
                    <input
                      type="text"
                      value={formData.motorHp}
                      onChange={(e) =>
                        setFormData({ ...formData, motorHp: e.target.value })
                      }
                      className="w-full bg-transparent outline-none text-sm text-center"
                    />
                  </div>
                  <div className="text-center">
                    {/* Empty cell for alignment */}
                  </div>
                </div>
              </div>
            </div>

            {/* Duct System Row */}
            <div className="grid grid-cols-2">
              <div className="p-2 border-r border-gray-300">
                <div className="flex items-center">
                  <div className="text-xs font-bold mr-2">AREA SERVED:</div>
                  <input
                    type="text"
                    value={formData.areaServed}
                    onChange={(e) =>
                      setFormData({ ...formData, areaServed: e.target.value })
                    }
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <div className="text-xs font-bold mr-2">INSTRUMENTS:</div>
                  <input
                    type="text"
                    value={formData.instruments}
                    onChange={(e) =>
                      setFormData({ ...formData, instruments: e.target.value })
                    }
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="p-2 flex items-center justify-end space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.supply}
                    onChange={(e) =>
                      setFormData({ ...formData, supply: e.target.checked })
                    }
                    className="form-checkbox text-[#0066A1]"
                  />
                  <span className="text-sm">SUPPLY</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.return}
                    onChange={(e) =>
                      setFormData({ ...formData, return: e.target.checked })
                    }
                    className="form-checkbox text-[#0066A1]"
                  />
                  <span className="text-sm">RETURN</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.exhaust}
                    onChange={(e) =>
                      setFormData({ ...formData, exhaust: e.target.checked })
                    }
                    className="form-checkbox text-[#0066A1]"
                  />
                  <span className="text-sm">EXHAUST</span>
                </label>
              </div>
            </div>
          </div>

          {/* Measurement Table Section */}
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
                <div className="p-2 text-xs font-bold text-center">REMARKS</div>
              </div>

              {/* Table Body */}
              {formData.measurements.map((measurement, index) => (
                <div
                  key={index}
                  className="grid grid-cols-8 border-b border-gray-300"
                >
                  <div className="p-2 border-r border-gray-300">
                    <input
                      type="text"
                      value={measurement.floorNo}
                      onChange={(e) =>
                        handleMeasurementChange(
                          index,
                          "floorNo",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="p-2 border-r border-gray-300">
                    <input
                      type="text"
                      value={measurement.typeOfOutlet}
                      onChange={(e) =>
                        handleMeasurementChange(
                          index,
                          "typeOfOutlet",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="p-2 border-r border-gray-300">
                    <input
                      type="text"
                      value={measurement.sizeIn}
                      onChange={(e) =>
                        handleMeasurementChange(index, "sizeIn", e.target.value)
                      }
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="p-2 border-r border-gray-300">
                    <input
                      type="text"
                      value={measurement.areaFt}
                      onChange={(e) =>
                        handleMeasurementChange(index, "areaFt", e.target.value)
                      }
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="p-2 border-r border-gray-300">
                    <input
                      type="text"
                      value={measurement.velFpm}
                      onChange={(e) =>
                        handleMeasurementChange(index, "velFpm", e.target.value)
                      }
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="p-2 border-r border-gray-300">
                    <input
                      type="text"
                      value={measurement.actualCfm}
                      onChange={(e) =>
                        handleMeasurementChange(
                          index,
                          "actualCfm",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="p-2 border-r border-gray-300">
                    <input
                      type="text"
                      value={measurement.reqCfm}
                      onChange={(e) =>
                        handleMeasurementChange(index, "reqCfm", e.target.value)
                      }
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="p-2">
                    <input
                      type="text"
                      value={measurement.remarks}
                      onChange={(e) =>
                        handleMeasurementChange(
                          index,
                          "remarks",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Line Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddLine}
                className="px-4 py-2 text-sm font-medium text-[#0066A1] border border-[#0066A1] rounded-md hover:bg-[#0066A1] hover:text-white transition-colors"
              >
                Add Line
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => router.push("/select-form")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066A1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#0066A1] border border-transparent rounded-md hover:bg-[#0055A1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066A1]"
            >
              Save Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
