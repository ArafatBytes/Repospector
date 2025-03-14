"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function EditAirBalancingReport() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [loading, setLoading] = useState(true);
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
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/air-balancing/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setFormData({
          ...data,
          inspectionDate: format(new Date(data.inspectionDate), "yyyy-MM-dd"),
        });
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
      const response = await fetch(`/api/air-balancing/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update report");
      }

      toast.success("Report updated successfully");
      router.push(userId ? `/dashboard?userId=${userId}` : "/dashboard");
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Dashboard Link */}
        <Link
          href={userId ? `/dashboard?userId=${userId}` : "/dashboard"}
          className="text-[#0066A1] hover:text-[#004d7a] mb-8 inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="mb-8 border-b border-[#0066A1] pb-6">
          <div className="flex justify-between items-start">
            {/* Logo and Company Info */}
            <div className="flex items-start">
              <div className="border-r-2 border-[#0066A1] pr-4 mr-4">
                <div className="text-3xl font-bold text-[#0066A1] tracking-wider">
                  SHAHRISH
                </div>
                <div className="text-[0.65rem] text-[#0066A1] tracking-wider mt-0.5">
                  ENGINEERING • SURVEYING • CONSTRUCTION INSPECTION
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="text-[0.65rem] text-right">
              <div className="font-bold mb-1">
                NYC DOB SPECIAL INSPECTION AGENCY# 008524
              </div>
              <div>
                <span className="font-bold">NEW YORK OFFICE:</span> 208 WEST 29
                <sup>TH</sup> STREET, SUITE 603, NEW YORK,
              </div>
              <div className="mb-1">NY 10001, T: (646) 797 3518</div>
              <div>
                <span className="font-bold">LONG ISLAND OFFICE:</span> 535
                BROADHOLLOW ROAD, SUITE B7,
              </div>
              <div className="mb-1">MELVILLE, NY 11747, T: (631) 393 6020</div>
              <div>
                E:{" "}
                <a href="mailto:INFO@SHAHRISH.NET" className="text-[#0066A1]">
                  INFO@SHAHRISH.NET
                </a>{" "}
                | W:{" "}
                <a href="http://WWW.SHAHRISH.NET" className="text-[#0066A1]">
                  WWW.SHAHRISH.NET
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
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
              onClick={() =>
                router.push(
                  userId ? `/dashboard?userId=${userId}` : "/dashboard"
                )
              }
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
