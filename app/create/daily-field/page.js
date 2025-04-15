"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function DailyFieldReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      const response = await fetch("/api/daily-field", {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
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

          {/* Form Fields Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  DOB Job Number
                </label>
                <input
                  type="text"
                  value={formData.dobJobNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, dobJobNumber: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time In/Out
                </label>
                <input
                  type="text"
                  value={formData.timeInOut}
                  onChange={(e) =>
                    setFormData({ ...formData, timeInOut: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Report Number
                </label>
                <input
                  type="text"
                  value={formData.reportNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, reportNumber: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Site Weather (°F)
                </label>
                <input
                  type="text"
                  value={formData.siteWeather}
                  onChange={(e) =>
                    setFormData({ ...formData, siteWeather: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                className="w-full mb-2 p-1 border-none focus:outline-none"
                placeholder="Contractor Name"
                required
              />
              <input
                type="text"
                value={`NYC DOB Contractor ID # ${formData.contractor.dobContractorId}`}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractor: {
                      ...formData.contractor,
                      dobContractorId: e.target.value.replace(
                        "NYC DOB Contractor ID # ",
                        ""
                      ),
                    },
                  })
                }
                className="w-full p-1 border-none focus:outline-none"
                required
              />
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
                    <input
                      type="text"
                      value={formData.laborAndEquipment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          laborAndEquipment: e.target.value,
                        })
                      }
                      className="w-full border-none focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">
                    Activities for the Day
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={formData.activitiesForDay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          activitiesForDay: e.target.value,
                        })
                      }
                      className="w-full border-none focus:outline-none"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">
                    Planned Activities for Tomorrow
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={formData.plannedActivitiesForTomorrow}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plannedActivitiesForTomorrow: e.target.value,
                        })
                      }
                      className="w-full border-none focus:outline-none"
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
                      className="w-full text-right italic border-none focus:outline-none"
                      placeholder="Enter signature"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Photographs Section */}
          <div className="mb-6">
            <div className="font-bold text-lg mb-4">PHOTOGRAPHS</div>
            <div className="grid grid-cols-2 gap-8">
              {formData.photographs.map((photo, index) => (
                <div key={index} className="border border-gray-300 p-4">
                  <div className="mb-4">
                    {photo.image ? (
                      <div className="relative">
                        <img
                          src={photo.image}
                          alt={`Photo ${index + 1}`}
                          className="w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="relative h-48 bg-gray-100">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoChange(index, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-gray-500 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="mt-1">Click to upload image</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={photo.caption || ""}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    placeholder="Add caption"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddPhoto}
              className="mt-4 bg-[#0066A1] text-white px-4 py-2 rounded hover:bg-[#004d7a] transition-colors"
            >
              Add Another Photo
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0066A1] text-white py-2 px-4 rounded-md hover:bg-[#004d7a] transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
