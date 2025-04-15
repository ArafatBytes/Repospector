"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function EditDailyFieldReport() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    client: "",
    projectSiteAddress: "",
    dobJobNumber: "",
    inspectorName: "",
    timeInOut: "",
    reportNumber: "",
    siteWeather: "",
    inspectionDate: format(new Date(), "yyyy-MM-dd"),
    contractor: {
      name: "",
      dobContractorId: "",
    },
    laborAndEquipment: "",
    activitiesForDay: "",
    plannedActivitiesForTomorrow: "",
    signatureOfProfessionalEngineer: "",
    hasPhotographs: true,
    photographs: [],
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/daily-field/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();

        // Format the date to YYYY-MM-DD for the input
        const formattedData = {
          ...data,
          inspectionDate: format(new Date(data.inspectionDate), "yyyy-MM-dd"),
        };

        setFormData(formattedData);
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

  const handlePhotoChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotographs = [...formData.photographs];
        newPhotographs[index] = {
          ...newPhotographs[index],
          image: reader.result,
        };
        setFormData({
          ...formData,
          photographs: newPhotographs,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (index, caption) => {
    const newPhotographs = [...formData.photographs];
    newPhotographs[index] = {
      ...newPhotographs[index],
      caption,
    };
    setFormData({
      ...formData,
      photographs: newPhotographs,
    });
  };

  const handleAddPhoto = () => {
    setFormData({
      ...formData,
      photographs: [...formData.photographs, { image: "", caption: "" }],
    });
  };

  const handleDeletePhoto = (index) => {
    const newPhotographs = formData.photographs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      photographs: newPhotographs,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/daily-field/${params.id}`, {
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
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-[#0066A1] hover:text-[#004d7a] transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Report Content */}
          <div className="border border-gray-300 p-8">
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

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Client</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Project Site Address
                  </label>
                  <input
                    type="text"
                    value={formData.projectSiteAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectSiteAddress: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    DOB Job Number
                  </label>
                  <input
                    type="text"
                    value={formData.dobJobNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, dobJobNumber: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Inspector Name
                  </label>
                  <input
                    type="text"
                    value={formData.inspectorName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inspectorName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Inspection Date
                  </label>
                  <input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inspectionDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Time In/Out</label>
                  <input
                    type="text"
                    value={formData.timeInOut}
                    onChange={(e) =>
                      setFormData({ ...formData, timeInOut: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Report Number
                  </label>
                  <input
                    type="text"
                    value={formData.reportNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, reportNumber: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Site Weather (°F)
                  </label>
                  <input
                    type="text"
                    value={formData.siteWeather}
                    onChange={(e) =>
                      setFormData({ ...formData, siteWeather: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="bg-[#0066A1] text-white text-center py-2 font-bold text-lg mb-6">
              DAILY FIELD REPORT
            </div>

            {/* Contractor Information */}
            <div className="mb-6">
              <div className="font-bold mb-2">CONTRACTOR:</div>
              <div className="border border-gray-300 p-3">
                <div className="mb-4">
                  <input
                    type="text"
                    value={formData.contractor.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractor: {
                          ...formData.contractor,
                          name: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 p-2"
                    placeholder="Contractor Name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.contractor.dobContractorId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractor: {
                          ...formData.contractor,
                          dobContractorId: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 p-2"
                    placeholder="NYC DOB Contractor ID #"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Activities Table */}
            <div className="mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 w-1/3 font-medium">
                      Labor & Equipment
                    </td>
                    <td className="border border-gray-300 p-2">
                      <textarea
                        value={formData.laborAndEquipment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            laborAndEquipment: e.target.value,
                          })
                        }
                        className="w-full border-none p-0 focus:outline-none"
                        rows={3}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">
                      Activities for the Day
                    </td>
                    <td className="border border-gray-300 p-2">
                      <textarea
                        value={formData.activitiesForDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            activitiesForDay: e.target.value,
                          })
                        }
                        className="w-full border-none p-0 focus:outline-none"
                        rows={3}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-medium">
                      Planned Activities for Tomorrow
                    </td>
                    <td className="border border-gray-300 p-2">
                      <textarea
                        value={formData.plannedActivitiesForTomorrow}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            plannedActivitiesForTomorrow: e.target.value,
                          })
                        }
                        className="w-full border-none p-0 focus:outline-none"
                        rows={3}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Section */}
            <div className="mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 w-1/3">
                      <div className="font-medium">
                        Signature of the Professional Engineer
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={formData.signatureOfProfessionalEngineer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            signatureOfProfessionalEngineer: e.target.value,
                          })
                        }
                        className="w-full border-none p-0 focus:outline-none text-right italic"
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Photographs Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-lg">PHOTOGRAPHS</div>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="bg-[#0066A1] text-white px-4 py-2 rounded hover:bg-[#004d7a] transition-colors"
                >
                  Add Photo
                </button>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {formData.photographs.map((photo, index) => (
                  <div key={index} className="border border-gray-300 p-4">
                    <div className="mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoChange(index, e)}
                        className="mb-2"
                      />
                      {photo.image && (
                        <img
                          src={photo.image}
                          alt={`Preview ${index + 1}`}
                          className="w-full object-contain mb-2"
                        />
                      )}
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) =>
                          handleCaptionChange(index, e.target.value)
                        }
                        placeholder="Enter caption"
                        className="w-full border border-gray-300 p-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete Photo
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0066A1] text-white px-6 py-2 rounded hover:bg-[#004d7a] transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Report"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
