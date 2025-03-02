"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function FirestoppingReport() {
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
    siteContact: "",
    plansReferenced: "",
    areaInspected: "",
    materialUsed: "",
    inspectionOutcome: "",
    nonConformanceNotes: "",
    inspectionObservations: "",
    inspectorSignature: "",
    hasPhotographs: false,
    photographs: [],
    checklist: {
      firestoppingMaterialApproved: {
        status: "",
        details: "",
      },
      penetrationsProperlySealed: {
        status: "",
        details: "",
      },
    },
  });

  // Add photo handling functions
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

  const handleDeletePhoto = (e, index) => {
    e.preventDefault(); // Prevent form submission
    const newPhotographs = formData.photographs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      photographs:
        newPhotographs.length > 0
          ? newPhotographs
          : [{ image: "", caption: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/firestopping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

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
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Dashboard Link */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-[#0066A1] hover:text-[#004d7a] transition-colors flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
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

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            {/* Left side - Logo and Company Info */}
            <div>
              <h1 className="text-[#0066A1] text-3xl font-bold tracking-wider">
                SHAHRISH
              </h1>
              <p className="text-gray-500 text-xs italic mt-1">
                ENGINEERING • SURVEYING • CONSTRUCTION INSPECTION
              </p>
            </div>

            {/* Right side - Agency Info */}
            <div className="text-right ml-20">
              <p className="text-[#0066A1] font-medium">
                NYC DOB SPECIAL INSPECTION AGENCY# 008524
              </p>
              <div className="mt-2 text-sm">
                <p>
                  NEW YORK OFFICE: 208 WEST 25TH STREET, SUITE# 603, NEW YORK,
                  NY 10001, T: (646) 797 3518
                </p>
                <p>
                  LONG ISLAND OFFICE: 535 BROADHOLLOW ROAD, SUITE# 87, MELVILLE,
                  NY 11747, T: (631) 393 6020
                </p>
                <p>
                  E:{" "}
                  <a
                    href="mailto:INFO@SHAHRISH.NET"
                    className="text-[#0066A1] hover:underline"
                  >
                    INFO@SHAHRISH.NET
                  </a>{" "}
                  | W:{" "}
                  <a
                    href="http://WWW.SHAHRISH.NET"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066A1] hover:underline"
                  >
                    WWW.SHAHRISH.NET
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client
              </label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inspection Date
              </label>
              <input
                type="date"
                required
                value={formData.inspectionDate}
                onChange={(e) =>
                  setFormData({ ...formData, inspectionDate: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Site Address
              </label>
              <input
                type="text"
                required
                value={formData.projectSiteAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectSiteAddress: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time In/Out
              </label>
              <input
                type="text"
                required
                value={formData.timeInOut}
                onChange={(e) =>
                  setFormData({ ...formData, timeInOut: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                DOB Job Number
              </label>
              <input
                type="text"
                required
                value={formData.dobJobNumber}
                onChange={(e) =>
                  setFormData({ ...formData, dobJobNumber: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Report Number
              </label>
              <input
                type="text"
                required
                value={formData.reportNumber}
                onChange={(e) =>
                  setFormData({ ...formData, reportNumber: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inspector Name
              </label>
              <input
                type="text"
                required
                value={formData.inspectorName}
                onChange={(e) =>
                  setFormData({ ...formData, inspectorName: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Site Weather (°F)
              </label>
              <input
                type="text"
                required
                value={formData.siteWeather}
                onChange={(e) =>
                  setFormData({ ...formData, siteWeather: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
          </div>

          {/* Form Title */}
          <div className="bg-[#0066A1] text-white text-center py-2 mb-6">
            <h2 className="text-xl font-bold">FIRESTOPPING INSPECTION</h2>
          </div>

          {/* Description */}
          <p className="text-sm mb-8">
            The above referenced project was visited to observe the firestopping
            application for compliance with project drawings, specifications,
            and NYC Building Code requirements.
          </p>

          {/* New Fields */}
          <div className="space-y-6">
            {/* Site Contact */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                SITE CONTACT:
              </label>
              <input
                type="text"
                required
                placeholder=""
                value={formData.siteContact}
                onChange={(e) =>
                  setFormData({ ...formData, siteContact: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>

            {/* Plans Referenced */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                PLANS REFERENCED:
              </label>
              <p className="text-xs text-gray-500 mb-1">
                (Plans date, Sealed by, Approved date)
              </p>
              <input
                type="text"
                required
                placeholder=""
                value={formData.plansReferenced}
                onChange={(e) =>
                  setFormData({ ...formData, plansReferenced: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>

            {/* Area/Location Inspected */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                AREA/LOCATION INSPECTED:
              </label>
              <p className="text-xs text-gray-500 mb-1">
                (Floors, Grid Lines, Col btw Fl., Stairs N° btw Fl., etc)
              </p>
              <input
                type="text"
                required
                placeholder=""
                value={formData.areaInspected}
                onChange={(e) =>
                  setFormData({ ...formData, areaInspected: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>

            {/* Material Used/Submittal Approved */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                MATERIAL USED/ SUBMITTAL APPROVED:
              </label>
              <input
                type="text"
                required
                placeholder=""
                value={formData.materialUsed}
                onChange={(e) =>
                  setFormData({ ...formData, materialUsed: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
          </div>

          {/* Inspection Outcome Section */}
          <div className="mt-8 border border-gray-300 p-4">
            <h3 className="font-bold mb-4">INSPECTION OUTCOME:</h3>
            <div className="space-y-4">
              {/* Incomplete Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="incomplete"
                  name="inspectionOutcome"
                  value="INCOMPLETE"
                  checked={formData.inspectionOutcome === "INCOMPLETE"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inspectionOutcome: e.target.value,
                    })
                  }
                  className="h-4 w-4 text-[#0066A1] focus:ring-[#0066A1]"
                />
                <label htmlFor="incomplete" className="ml-2 text-sm">
                  Incomplete Work: Re-inspection required.
                </label>
              </div>

              {/* Conformance Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="conformance"
                  name="inspectionOutcome"
                  value="CONFORMANCE"
                  checked={formData.inspectionOutcome === "CONFORMANCE"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inspectionOutcome: e.target.value,
                    })
                  }
                  className="h-4 w-4 text-[#0066A1] focus:ring-[#0066A1]"
                />
                <label htmlFor="conformance" className="ml-2 text-sm">
                  Conformance: Work is in conformance with contract drawings,
                  specifications and NYC BC.
                </label>
              </div>

              {/* Non-Conformance Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="nonConformance"
                  name="inspectionOutcome"
                  value="NON_CONFORMANCE"
                  checked={formData.inspectionOutcome === "NON_CONFORMANCE"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inspectionOutcome: e.target.value,
                    })
                  }
                  className="h-4 w-4 text-[#0066A1] focus:ring-[#0066A1]"
                />
                <label htmlFor="nonConformance" className="ml-2 text-sm">
                  Non-Conformance Work: Deficiencies noted and upon correction,
                  re-inspection required.
                </label>
              </div>
            </div>

            {/* Non-Conformance Notes */}
            <div className="mt-4">
              <h4 className="font-bold mb-2">Non-Conformance Notes:</h4>
              <textarea
                value={formData.nonConformanceNotes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nonConformanceNotes: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1] min-h-[100px]"
                placeholder=""
              />
            </div>
          </div>

          {/* Checklist Section */}
          <div className="mt-8">
            <h3 className="font-bold mb-4">
              CHECKLIST (Please check all applicable):
            </h3>
            <div className="border border-gray-300">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left font-bold w-1/2">
                      Requirements
                    </th>
                    <th className="py-2 px-4 text-center font-bold w-[80px]">
                      YES
                    </th>
                    <th className="py-2 px-4 text-center font-bold w-[80px]">
                      NO
                    </th>
                    <th className="py-2 px-4 text-center font-bold w-[80px]">
                      N/A
                    </th>
                    <th className="py-2 px-4 text-left font-bold">
                      Inspection Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Firestopping Material Row */}
                  <tr className="border-t border-gray-300">
                    <td className="py-2 px-4">
                      a) Is firestopping material used approved?
                    </td>
                    {["YES", "NO", "N/A"].map((value) => (
                      <td key={value} className="py-2 px-4 text-center">
                        <input
                          type="radio"
                          name="firestoppingMaterialApproved"
                          value={value}
                          checked={
                            formData.checklist.firestoppingMaterialApproved
                              .status === value
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                firestoppingMaterialApproved: {
                                  ...formData.checklist
                                    .firestoppingMaterialApproved,
                                  status: e.target.value,
                                },
                              },
                            })
                          }
                          className="h-4 w-4 text-[#0066A1] focus:ring-[#0066A1]"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={
                          formData.checklist.firestoppingMaterialApproved
                            .details
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            checklist: {
                              ...formData.checklist,
                              firestoppingMaterialApproved: {
                                ...formData.checklist
                                  .firestoppingMaterialApproved,
                                details: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                  </tr>

                  {/* Penetrations Properly Sealed Row */}
                  <tr className="border-t border-gray-300">
                    <td className="py-2 px-4">
                      b) Are all penetrations or areas that require firestopping
                      sealed properly?
                    </td>
                    {["YES", "NO", "N/A"].map((value) => (
                      <td key={value} className="py-2 px-4 text-center">
                        <input
                          type="radio"
                          name="penetrationsProperlySealed"
                          value={value}
                          checked={
                            formData.checklist.penetrationsProperlySealed
                              .status === value
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                penetrationsProperlySealed: {
                                  ...formData.checklist
                                    .penetrationsProperlySealed,
                                  status: e.target.value,
                                },
                              },
                            })
                          }
                          className="h-4 w-4 text-[#0066A1] focus:ring-[#0066A1]"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={
                          formData.checklist.penetrationsProperlySealed.details
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            checklist: {
                              ...formData.checklist,
                              penetrationsProperlySealed: {
                                ...formData.checklist
                                  .penetrationsProperlySealed,
                                details: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Observations Section */}
          <div className="mt-8">
            <h3 className="font-bold mb-4">
              INSPECTION OBSERVATIONS / REMARKS:
            </h3>
            <div className="border border-gray-300 p-4">
              <textarea
                value={formData.inspectionObservations}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inspectionObservations: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1] min-h-[150px]"
                placeholder=""
              />
            </div>
          </div>

          {/* Inspector's Signature Section */}
          <div className="mt-8">
            <h3 className="font-bold mb-4">INSPECTOR&apos;S SIGNATURE:</h3>
            <div className="border border-gray-300 p-4">
              <input
                type="text"
                required
                value={formData.inspectorSignature}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inspectorSignature: e.target.value,
                  })
                }
                placeholder="Type your full name"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0066A1] focus:border-[#0066A1]"
              />
            </div>
          </div>

          {/* Photographs Section */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">PHOTOGRAPHS:</h3>
            <div className="space-y-4">
              {formData.photographs.map((photo, index) => (
                <div key={index} className="border p-4 rounded">
                  <div className="mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(index, e)}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Add caption"
                      value={photo.caption || ""}
                      onChange={(e) =>
                        handleCaptionChange(index, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeletePhoto(e, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete Photo
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPhoto}
                className="bg-[#834CFF] text-white px-4 py-2 rounded hover:bg-[#6617CB] transition-colors"
              >
                Add Photo
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0066A1] text-white px-4 py-2 rounded-md hover:bg-[#004d7a] focus:outline-none focus:ring-2 focus:ring-[#0066A1] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
