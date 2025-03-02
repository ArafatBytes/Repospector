"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function CreateInsulationReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    projectSiteAddress: "",
    projectId: "",
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
    checklist: {
      verifyCertificateOfCompliance: { status: "", details: "" },
      verifyInsulationInstalled: { status: "", details: "" },
      verifyRValueVisible: { status: "", details: "" },
    },
    inspectionObservations: "",
    inspectorSignature: "",
    hasPhotographs: true,
    photographs: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChecklistChange = (field, type, value) => {
    setFormData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [field]: {
          ...prev.checklist[field],
          [type]: value,
        },
      },
    }));
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

  const handleAddPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photographs: [...prev.photographs, { image: "", caption: "" }],
    }));
  };

  const handleDeletePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photographs: prev.photographs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/insulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create report");
      }

      toast.success("Report created successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Failed to create report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-[#0066A1] hover:text-[#004d7a] transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-start">
              {/* Company Logo and Info */}
              <div>
                <h1 className="text-[#0066A1] text-3xl font-bold tracking-wider">
                  SHAHRISH
                </h1>
                <p className="text-gray-500 text-xs mt-1">
                  ENGINEERING • SURVEYING • CONSTRUCTION INSPECTION
                </p>
              </div>

              {/* Company Contact Info */}
              <div className="text-right text-xs ml-16">
                <p className="text-[#0066A1] font-semibold">
                  NYC DOB SPECIAL INSPECTION AGENCY# 008524
                </p>
                <div className="mt-1">
                  <p>
                    NEW YORK OFFICE: 208 WEST 25TH STREET, SUITE# 603, NEW YORK,
                    NY 10001, T: (646) 797 3518
                  </p>
                  <p>
                    LONG ISLAND OFFICE: 535 BROADHOLLOW ROAD, SUITE# 87,
                    MELVILLE, NY 11747, T: (631) 393 6020
                  </p>
                  <p>E: INFO@SHAHRISH.NET | W: WWW.SHAHRISH.NET</p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Client:
                </label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Project Site Address:
                </label>
                <input
                  type="text"
                  name="projectSiteAddress"
                  value={formData.projectSiteAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Project ID:
                </label>
                <input
                  type="text"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Inspector Name:
                </label>
                <input
                  type="text"
                  name="inspectorName"
                  value={formData.inspectorName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Inspection Date:
                </label>
                <input
                  type="date"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Time In/Out:
                </label>
                <input
                  type="text"
                  name="timeInOut"
                  value={formData.timeInOut}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Report Number:
                </label>
                <input
                  type="text"
                  name="reportNumber"
                  value={formData.reportNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Site Weather (°F):
                </label>
                <input
                  type="text"
                  name="siteWeather"
                  value={formData.siteWeather}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>

          {/* Report Title */}
          <div className="bg-[#0066A1] text-white text-center py-2 mb-6">
            <h2 className="text-xl font-bold">
              ENERGY CODE COMPLIANCE INSULATION AND R-VALUE REPORT
            </h2>
          </div>

          <div className="text-sm mb-6">
            <p className="italic">
              The above referenced project was visited to observe the Insulation
              placement and R-value for compliance with project drawings,
              specifications, and NYC Building Code requirements.
            </p>
          </div>

          {/* Site Contact */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">SITE CONTACT:</h3>
            <input
              type="text"
              name="siteContact"
              value={formData.siteContact}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Plans Referenced */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">PLANS REFERENCED:</h3>
            <input
              type="text"
              name="plansReferenced"
              value={formData.plansReferenced}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              (Plans date, Sealed by, Approved date)
            </p>
          </div>

          {/* Area/Location Inspected */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">AREA/LOCATION INSPECTED:</h3>
            <input
              type="text"
              name="areaInspected"
              value={formData.areaInspected}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              (Floors, Grid Lines, Col btw Fl., Stairs N° btw Fl., etc)
            </p>
          </div>

          {/* Material Used */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              MATERIAL USED/SUBMITTAL APPROVED:
            </h3>
            <input
              type="text"
              name="materialUsed"
              value={formData.materialUsed}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Inspection Outcome */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">INSPECTION OUTCOME:</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="radio"
                  id="incomplete"
                  name="inspectionOutcome"
                  value="INCOMPLETE"
                  checked={formData.inspectionOutcome === "INCOMPLETE"}
                  onChange={handleInputChange}
                  className="mt-1 mr-2"
                />
                <label htmlFor="incomplete" className="text-sm">
                  Incomplete Work: Re-inspection required.
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="conformance"
                  name="inspectionOutcome"
                  value="CONFORMANCE"
                  checked={formData.inspectionOutcome === "CONFORMANCE"}
                  onChange={handleInputChange}
                  className="mt-1 mr-2"
                />
                <label htmlFor="conformance" className="text-sm">
                  Conformance: Work is in conformance with contract drawings,
                  specifications and NYC BC.
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="radio"
                  id="nonConformance"
                  name="inspectionOutcome"
                  value="NON_CONFORMANCE"
                  checked={formData.inspectionOutcome === "NON_CONFORMANCE"}
                  onChange={handleInputChange}
                  className="mt-1 mr-2"
                />
                <label htmlFor="nonConformance" className="text-sm">
                  Non-Conformance Work: Deficiencies noted and upon correction,
                  re-inspection required.
                </label>
              </div>
            </div>

            {/* Non-Conformance Notes */}
            {formData.inspectionOutcome === "NON_CONFORMANCE" && (
              <div className="mt-4">
                <h4 className="font-bold mb-2">Non-Conformance Notes:</h4>
                <textarea
                  name="nonConformanceNotes"
                  value={formData.nonConformanceNotes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              CHECKLIST (Please check all applicable):
            </h3>
            <div className="border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left w-1/2">Requirements</th>
                    <th className="p-2 text-center w-16">YES</th>
                    <th className="p-2 text-center w-16">NO</th>
                    <th className="p-2 text-center w-16">N/A</th>
                    <th className="p-2 text-left">Inspection Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">
                      a) Verify certificate of compliance for insulation
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyCertificateOfCompliance"
                        value="YES"
                        checked={
                          formData.checklist.verifyCertificateOfCompliance
                            .status === "YES"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyCertificateOfCompliance",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyCertificateOfCompliance"
                        value="NO"
                        checked={
                          formData.checklist.verifyCertificateOfCompliance
                            .status === "NO"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyCertificateOfCompliance",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyCertificateOfCompliance"
                        value="N/A"
                        checked={
                          formData.checklist.verifyCertificateOfCompliance
                            .status === "N/A"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyCertificateOfCompliance",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={
                          formData.checklist.verifyCertificateOfCompliance
                            .details
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyCertificateOfCompliance",
                            "details",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">
                      b) Verify insulation is installed in compliance with
                      approved documents and manufacturer&apos;s guidelines
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyInsulationInstalled"
                        value="YES"
                        checked={
                          formData.checklist.verifyInsulationInstalled
                            .status === "YES"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyInsulationInstalled",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyInsulationInstalled"
                        value="NO"
                        checked={
                          formData.checklist.verifyInsulationInstalled
                            .status === "NO"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyInsulationInstalled",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyInsulationInstalled"
                        value="N/A"
                        checked={
                          formData.checklist.verifyInsulationInstalled
                            .status === "N/A"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyInsulationInstalled",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={
                          formData.checklist.verifyInsulationInstalled.details
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyInsulationInstalled",
                            "details",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      c) Verify R-value is visible and identifiable on each
                      piece of insulation
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyRValueVisible"
                        value="YES"
                        checked={
                          formData.checklist.verifyRValueVisible.status ===
                          "YES"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyRValueVisible",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyRValueVisible"
                        value="NO"
                        checked={
                          formData.checklist.verifyRValueVisible.status === "NO"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyRValueVisible",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="radio"
                        name="verifyRValueVisible"
                        value="N/A"
                        checked={
                          formData.checklist.verifyRValueVisible.status ===
                          "N/A"
                        }
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyRValueVisible",
                            "status",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={formData.checklist.verifyRValueVisible.details}
                        onChange={(e) =>
                          handleChecklistChange(
                            "verifyRValueVisible",
                            "details",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Observations */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              INSPECTION OBSERVATIONS / REMARKS:
            </h3>
            <textarea
              name="inspectionObservations"
              value={formData.inspectionObservations}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={6}
              required
            />
          </div>

          {/* Inspector's Signature */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Inspector&apos;s Signature:</h3>
            <input
              type="text"
              name="inspectorSignature"
              value={formData.inspectorSignature}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Photographs Section */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">PHOTOGRAPHS:</h3>

            {/* Photo Grid */}
            {formData.photographs.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {formData.photographs.map((photo, index) => (
                  <div key={index} className="border p-2">
                    <div className="relative mb-2">
                      {photo.image ? (
                        <>
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
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="w-full bg-gray-100 flex items-center justify-center">
                          <label className="cursor-pointer p-4 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoChange(index, e)}
                              className="hidden"
                            />
                            <span className="text-gray-500">
                              Click to add photo
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) =>
                          handleCaptionChange(index, e.target.value)
                        }
                        placeholder={`Photo ${index + 1}: Enter caption`}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Photo Button */}
            <button
              type="button"
              onClick={handleAddPhoto}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              + Add Photo
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0066A1] text-white py-2 px-4 rounded hover:bg-[#004d7a] transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
