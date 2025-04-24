"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function EditInsulationReport() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    inspectionDate: "",
    projectSiteAddress: "",
    projectId: "",
    inspectorName: "",
    timeInOut: "",
    reportNumber: "",
    siteWeather: "",
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
      verifyCertificateOfCompliance: {
        status: "",
        details: "",
      },
      verifyInsulationInstalled: {
        status: "",
        details: "",
      },
      verifyRValueVisible: {
        status: "",
        details: "",
      },
    },
  });

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/insulation/${params.id}`);
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch report");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/insulation/${params.id}`, {
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
      router.push(`/insulation/${params.id}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update report");
    } finally {
      setSubmitting(false);
    }
  };

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
            className="text-[#834CFF] hover:text-[#6617CB] transition-colors"
          >
            ← Back to Dashboard
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
              <p>
                <strong>NYC DOB SIA# 008524</strong>
              </p>
              <p>15 WEST 38TH STREET, 8TH FLOOR (SUITE 808)</p>
              <p>NEW YORK, NEW YORK 10018</p>
              <p>T: (212) 632-8430</p>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Client:</label>
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
                <label className="block font-semibold mb-1">
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
                <label className="block font-semibold mb-1">Project ID:</label>
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
                <label className="block font-semibold mb-1">
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
                <label className="block font-semibold mb-1">
                  Inspection Date:
                </label>
                <input
                  type="date"
                  name="inspectionDate"
                  value={formData.inspectionDate.split("T")[0]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Time In/Out:</label>
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
                <label className="block font-semibold mb-1">
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
                <label className="block font-semibold mb-1">
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
            <h2 className="text-xl font-bold">INSULATION INSPECTION</h2>
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
              (Floors, Grid Lines, Col btw Fl., Stairs N btw Fl., etc)
            </p>
          </div>

          {/* Material Used/Submittal Approved */}
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
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="inspectionOutcome"
                  value="INCOMPLETE"
                  checked={formData.inspectionOutcome === "INCOMPLETE"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label>Incomplete Work: Re-inspection required.</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="inspectionOutcome"
                  value="CONFORMANCE"
                  checked={formData.inspectionOutcome === "CONFORMANCE"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label>
                  Conformance: Work is in conformance with contract drawings,
                  specifications and NYC BC.
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="inspectionOutcome"
                  value="NON_CONFORMANCE"
                  checked={formData.inspectionOutcome === "NON_CONFORMANCE"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label>
                  Non-Conformance Work: Deficiencies noted and upon correction,
                  re-inspection required.
                </label>
              </div>
            </div>
          </div>

          {/* Non-Conformance Notes */}
          {formData.inspectionOutcome === "NON_CONFORMANCE" && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">NON-CONFORMANCE NOTES:</h3>
              <textarea
                name="nonConformanceNotes"
                value={formData.nonConformanceNotes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder="Enter non-conformance notes..."
                required
              />
            </div>
          )}

          {/* Checklist */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              CHECKLIST (Please check all applicable):
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Requirements</th>
                  <th className="border p-2 w-20 text-center">YES</th>
                  <th className="border p-2 w-20 text-center">NO</th>
                  <th className="border p-2 w-20 text-center">N/A</th>
                  <th className="border p-2">Inspection Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    a) Verify certificate of compliance for insulation
                  </td>
                  <td className="border p-2 text-center">
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
                  <td className="border p-2 text-center">
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
                  <td className="border p-2 text-center">
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
                  <td className="border p-2">
                    <input
                      type="text"
                      value={
                        formData.checklist.verifyCertificateOfCompliance.details
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
                <tr>
                  <td className="border p-2">
                    b) Verify insulation is installed in compliance with
                    approved documents and manufacturer&apos;s guidelines
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="verifyInsulationInstalled"
                      value="YES"
                      checked={
                        formData.checklist.verifyInsulationInstalled.status ===
                        "YES"
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
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="verifyInsulationInstalled"
                      value="NO"
                      checked={
                        formData.checklist.verifyInsulationInstalled.status ===
                        "NO"
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
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="verifyInsulationInstalled"
                      value="N/A"
                      checked={
                        formData.checklist.verifyInsulationInstalled.status ===
                        "N/A"
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
                  <td className="border p-2">
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
                  <td className="border p-2">
                    c) Verify R-value is visible and identifiable on each piece
                    of insulation
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="verifyRValueVisible"
                      value="YES"
                      checked={
                        formData.checklist.verifyRValueVisible.status === "YES"
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
                  <td className="border p-2 text-center">
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
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="verifyRValueVisible"
                      value="N/A"
                      checked={
                        formData.checklist.verifyRValueVisible.status === "N/A"
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
                  <td className="border p-2">
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

          {/* Inspection Observations */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              INSPECTION OBSERVATIONS / REMARKS:
            </h3>
            <textarea
              name="inspectionObservations"
              value={formData.inspectionObservations}
              onChange={handleInputChange}
              className="w-full p-2 border rounded min-h-[100px]"
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

          {/* Photographs */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">PHOTOGRAPHS:</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.photographs.map((photo, index) => (
                <div key={index} className="border p-4 relative">
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(index, e)}
                      className="w-full"
                    />
                  </div>
                  {photo.image && (
                    <div className="relative aspect-video mb-2">
                      <Image
                        src={photo.image}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Add caption"
                    value={photo.caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddPhoto}
              className="mt-4 border-2 border-dashed border-gray-300 p-4 w-full text-gray-500 hover:text-gray-700 hover:border-gray-500 transition-colors rounded"
            >
              + Add Photo
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0066A1] text-white py-2 px-4 rounded hover:bg-[#004d7a] transition-colors disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
