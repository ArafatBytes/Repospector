"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Image from "next/image";

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
    photos: [],
  });

  const [currentPhoto, setCurrentPhoto] = useState({
    image: "",
    description: "",
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPhoto((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = () => {
    if (currentPhoto.image) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, currentPhoto],
      }));
      setCurrentPhoto({ image: "", description: "" });
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoDescriptionChange = (index, description) => {
    const newPhotos = [...formData.photos];
    newPhotos[index] = {
      ...newPhotos[index],
      description,
    };
    setFormData((prev) => ({
      ...prev,
      photos: newPhotos,
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

          {/* Photos Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Photos</h2>
            <div className="space-y-4">
              {/* Current Photo Upload */}
              <div className="border border-gray-300 p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#0066A1] file:text-white
                        hover:file:bg-[#0055A1]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={!currentPhoto.image}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#0066A1] border border-transparent rounded-md hover:bg-[#0055A1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066A1] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Photo
                  </button>
                </div>
                {currentPhoto.image && (
                  <div className="mt-4">
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={currentPhoto.image}
                        alt="Preview"
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                    <textarea
                      value={currentPhoto.description}
                      onChange={(e) =>
                        setCurrentPhoto((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Add a description for this photo..."
                      className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066A1] focus:border-transparent"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Uploaded Photos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 p-4 rounded-md"
                  >
                    <div className="relative">
                      <img
                        src={photo.image}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-auto rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      value={photo.description}
                      onChange={(e) =>
                        handlePhotoDescriptionChange(index, e.target.value)
                      }
                      placeholder="Add a description for this photo..."
                      className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066A1] focus:border-transparent"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
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
