"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function ConcreteReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    client: "",
    inspectionDate: format(new Date(), "yyyy-MM-dd"),
    projectSiteAddress: "",
    projectId: "",
    inspectorName: "",
    timeInOut: "",
    reportNumber: "",
    siteWeather: "",

    // Site Contact
    siteContact: "",

    // Plans Referenced
    plansReferenced: "",

    // Area/Location Inspected
    areaInspected: "",

    // Material Used/Submittal Approved
    materialUsed: "",

    // Inspection Outcome
    inspectionOutcome: "", // INCOMPLETE, CONFORMANCE, NON_CONFORMANCE
    nonConformanceNotes: "",

    // Attachments
    hasPhotographs: true,
    hasObservations: true,

    // Photographs
    photographs: [
      {
        image: null,
        caption: "",
      },
    ],

    // Checklist
    checklist: {
      shopDrawings: "",
      shopDrawingsDetails: "",
      gradeOfSteel: "",
      gradeOfSteelDetails: "",
      spacingCoordinated: "",
      spacingCoordinatedDetails: "",
      requiredClearance: "",
      requiredClearanceDetails: "",
      lengthOfSplices: "",
      lengthOfSplicesDetails: "",
      bendsWithinRadii: "",
      bendsWithinRadiiDetails: "",
      additionalBars: "",
      additionalBarsDetails: "",
      barsCleaned: "",
      barsCleanedDetails: "",
      dowelsForMarginal: "",
      dowelsForMarginalDetails: "",
      barsTiedAndSupported: "",
      barsTiedAndSupportedDetails: "",
      spacersTieWires: "",
      spacersTieWiresDetails: "",
      conduitSeparated: "",
      conduitSeparatedDetails: "",
      noConduitBelow: "",
      noConduitBelowDetails: "",
      noContactWithMetals: "",
      noContactWithMetalsDetails: "",
      barNotNearSurface: "",
      barNotNearSurfaceDetails: "",
      adequateClearance: "",
      adequateClearanceDetails: "",
      specialCoating: "",
      specialCoatingDetails: "",
      noBentBars: "",
      noBentBarsDetails: "",
      noBoxingOut: "",
      noBoxingOutDetails: "",
    },

    // Inspection Observations/Remarks
    remarks: "",

    // Report Type (for dashboard filtering)
    reportType: "CONCRETE",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Debug log
    console.log("Submitting form data:", JSON.stringify(formData, null, 2));
    console.log("Checklist data:", JSON.stringify(formData.checklist, null, 2));

    try {
      const response = await fetch("/api/concrete", {
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
        setFormData((prev) => ({
          ...prev,
          photographs: newPhotographs,
        }));
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
    setFormData((prev) => ({
      ...prev,
      photographs: newPhotographs,
    }));
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Header Section */}
        <div className="mb-8 border-b border-[#0066A1] pb-6">
          <div className="flex justify-between items-start">
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

          {/* REBAR INSPECTION REPORT Title */}
          <div className="text-center font-bold text-xl mb-6">
            REBAR INSPECTION REPORT
          </div>

          {/* Description Text */}
          <div className="text-sm mb-8">
            The above referenced project was visited to observe the concrete
            installation for compliance with project drawings, specifications,
            and NYC Building Code requirements BC 1704.4
          </div>

          {/* Additional Fields */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="font-bold block mb-2">SITE CONTACT:</label>
              <input
                type="text"
                value={formData.siteContact}
                onChange={(e) =>
                  setFormData({ ...formData, siteContact: e.target.value })
                }
                className="w-full border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="font-bold block mb-2">
                PLANS REFERENCED:
                <span className="text-sm font-normal ml-1">
                  (Plans date, Sealed by, Approved date)
                </span>
              </label>
              <input
                type="text"
                value={formData.plansReferenced}
                onChange={(e) =>
                  setFormData({ ...formData, plansReferenced: e.target.value })
                }
                className="w-full border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="font-bold block mb-2">
                AREA/LOCATION INSPECTED:
                <span className="text-sm font-normal ml-1">
                  (Floors, Grid Lines, Col btw Fl., Stairs № btw Fl., etc)
                </span>
              </label>
              <input
                type="text"
                value={formData.areaInspected}
                onChange={(e) =>
                  setFormData({ ...formData, areaInspected: e.target.value })
                }
                className="w-full border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="font-bold block mb-2">
                MATERIAL USED/ SUBMITTAL APPROVED:
              </label>
              <input
                type="text"
                value={formData.materialUsed}
                onChange={(e) =>
                  setFormData({ ...formData, materialUsed: e.target.value })
                }
                className="w-full border border-gray-300 p-2"
              />
            </div>
          </div>

          {/* Inspection Outcome */}
          <div className="mb-8">
            <div className="font-bold mb-4">INSPECTION OUTCOME:</div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inspectionOutcome === "INCOMPLETE"}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      inspectionOutcome:
                        formData.inspectionOutcome === "INCOMPLETE"
                          ? ""
                          : "INCOMPLETE",
                    })
                  }
                  className="mr-2"
                />
                Incomplete Work: Re-inspection required.
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inspectionOutcome === "CONFORMANCE"}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      inspectionOutcome:
                        formData.inspectionOutcome === "CONFORMANCE"
                          ? ""
                          : "CONFORMANCE",
                    })
                  }
                  className="mr-2"
                />
                Conformance: Work is in conformance with contract drawings,
                specifications and NYC BC.
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inspectionOutcome === "NON_CONFORMANCE"}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      inspectionOutcome:
                        formData.inspectionOutcome === "NON_CONFORMANCE"
                          ? ""
                          : "NON_CONFORMANCE",
                    })
                  }
                  className="mr-2"
                />
                Non-Conformance Work: Deficiencies noted and upon correction,
                re-inspection required.
              </label>
            </div>

            <div className="mt-4">
              <div className="font-bold mb-2">Non-Conformance Notes:</div>
              <div className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={formData.nonConformanceNotes || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nonConformanceNotes: e.target.value,
                    })
                  }
                  className="w-full outline-none text-red-500"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-8 flex items-center space-x-8">
            <div className="flex items-center">
              <span className="mr-2">📎 Photographs attached:</span>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={formData.hasPhotographs}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      hasPhotographs: !formData.hasPhotographs,
                    })
                  }
                  className="mr-1"
                />
                Yes
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={!formData.hasPhotographs}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      hasPhotographs: !formData.hasPhotographs,
                    })
                  }
                  className="mr-1"
                />
                No
              </label>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📋 Observations/Checklist attached:</span>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={formData.hasObservations}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      hasObservations: !formData.hasObservations,
                    })
                  }
                  className="mr-1"
                />
                Yes
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={!formData.hasObservations}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      hasObservations: !formData.hasObservations,
                    })
                  }
                  className="mr-1"
                />
                No
              </label>
            </div>
          </div>

          {/* Checklist */}
          <div className="mb-8">
            <div className="font-bold mb-4">
              CHECKLIST (Describe all applicable):
            </div>
            <div className="border border-gray-300">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b border-r border-gray-300 p-2 text-left w-1/2">
                      Requirements
                    </th>
                    <th className="border-b border-r border-gray-300 p-2 text-center">
                      YES
                    </th>
                    <th className="border-b border-r border-gray-300 p-2 text-center">
                      NO
                    </th>
                    <th className="border-b border-r border-gray-300 p-2 text-center">
                      N/A
                    </th>
                    <th className="border-b border-gray-300 p-2 text-left">
                      Inspection Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries({
                    shopDrawings: "Shop Drawings are approved and are on-site.",
                    gradeOfSteel: "Grade of steel delivered as required.",
                    spacingCoordinated:
                      "Spacing coordinated to suit masonry/concrete units.",
                    requiredClearance:
                      "Required clearance of steel from forms provided.",
                    lengthOfSplices:
                      "Length of splices and staggered splices are required.",
                    bendsWithinRadii:
                      "Bends within radii and tolerance are uniformly made.",
                    additionalBars:
                      "Additional bars at intersections, openings, and corners provided.",
                    barsCleaned: "Bars cleaned of material that effect bond.",
                    dowelsForMarginal: "Dowels for marginal bars at opening.",
                    barsTiedAndSupported:
                      "Bars tied and supported to avoid displacement.",
                    spacersTieWires: "Spacers, tie wires, chairs as required.",
                    conduitSeparated:
                      "Conduit is separated by 3 conduit diameter minimum.",
                    noConduitBelow:
                      "No conduit or pipe placed below rebar material except where approved.",
                    noContactWithMetals:
                      "No contact of bars is made with dissimilar metals.",
                    barNotNearSurface:
                      "Bar not near surface which may cause rusting.",
                    adequateClearance:
                      "Adequate Clearance provided for deposit of concrete.",
                    specialCoating: "Special coating as required.",
                    noBentBars:
                      "No bent bars and tension members installed except where approved.",
                    noBoxingOut:
                      "Unless approved, boxing out is not approved for subsequent grouting out.",
                  }).map(([key, label]) => (
                    <tr key={key} className="border-b border-gray-300">
                      <td className="border-r border-gray-300 p-2">{label}</td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          checked={formData.checklist[key] === "YES"}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                [key]: "YES",
                              },
                            })
                          }
                        />
                      </td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          checked={formData.checklist[key] === "NO"}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                [key]: "NO",
                              },
                            })
                          }
                        />
                      </td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          checked={formData.checklist[key] === "N/A"}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                [key]: "N/A",
                              },
                            })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={formData.checklist[`${key}Details`] || ""}
                          onChange={(e) => {
                            const detailsKey = `${key}Details`;
                            setFormData((prev) => ({
                              ...prev,
                              checklist: {
                                ...prev.checklist,
                                [detailsKey]: e.target.value,
                              },
                            }));
                          }}
                          className="w-full border-b border-gray-300 focus:border-[#0066A1] outline-none"
                          placeholder="Enter inspection details..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Observations/Remarks */}
          <div className="mb-8">
            <div className="font-bold mb-2">
              INSPECTION OBSERVATIONS / REMARKS:
            </div>
            <textarea
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="w-full border border-gray-300 p-2 min-h-[100px]"
            />
          </div>

          {/* Photographs Section */}
          <div className="mb-8">
            <div className="font-bold mb-4">PHOTOGRAPHS</div>
            <div className="grid grid-cols-2 gap-8">
              {formData.photographs.map((photo, index) => (
                <div key={index} className="border border-gray-300">
                  <div className="relative w-full">
                    {photo.image ? (
                      <>
                        <div
                          className="w-full"
                          style={{ position: "relative", paddingTop: "75%" }}
                        >
                          <img
                            src={photo.image}
                            alt={`Photo ${index + 1}`}
                            className="absolute inset-0 w-full h-full"
                            style={{
                              objectFit: "contain",
                              backgroundColor: "#f3f4f6",
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newPhotographs = formData.photographs.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              photographs: newPhotographs,
                            }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div
                        className="w-full"
                        style={{ position: "relative", paddingTop: "75%" }}
                      >
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoChange(index, e)}
                              className="hidden"
                              id={`photo-upload-${index}`}
                            />
                            <label
                              htmlFor={`photo-upload-${index}`}
                              className="cursor-pointer px-4 py-2 bg-[#0066A1] text-white rounded hover:bg-[#004d7a]"
                            >
                              Add Photo
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-300">
                    <div className="text-sm text-gray-600">
                      Photo {index + 1}:
                    </div>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) =>
                        handleCaptionChange(index, e.target.value)
                      }
                      placeholder="Enter photo description"
                      className="w-full border-b border-gray-300 focus:border-[#0066A1] outline-none px-2 py-1"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  photographs: [
                    ...prev.photographs,
                    { image: null, caption: "" },
                  ],
                }))
              }
              className="mt-4 px-4 py-2 bg-[#0066A1] text-white rounded hover:bg-[#004d7a]"
            >
              Add More Photos
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066A1]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0066A1] border border-transparent rounded-md hover:bg-[#004d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066A1]"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
