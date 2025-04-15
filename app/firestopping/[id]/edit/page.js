"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function EditFirestoppingReport() {
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
    siteContact: "",
    plansReferenced: "",
    areaInspected: "",
    materialUsed: "",
    inspectionOutcome: "",
    nonConformanceNotes: "",
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
    inspectionObservations: "",
    inspectorSignature: "",
    hasPhotographs: false,
    photographs: [],
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/firestopping/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      const formattedData = {
        ...data,
        inspectionDate: format(new Date(data.inspectionDate), "yyyy-MM-dd"),
      };
      setFormData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch report");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/firestopping/${params.id}`, {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChecklistChange = (item, field, value) => {
    setFormData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [item]: {
          ...prev.checklist[item],
          [field]: value,
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

  const handleDeletePhoto = (e, index) => {
    e.preventDefault();
    const newPhotographs = formData.photographs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      photographs:
        newPhotographs.length > 0
          ? newPhotographs
          : [{ image: "", caption: "" }],
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
                  name="dobJobNumber"
                  value={formData.dobJobNumber}
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
            <h2 className="text-xl font-bold">FIRESTOPPING INSPECTION</h2>
          </div>

          <div className="text-sm mb-6">
            <p className="italic">
              The above referenced project was visited to observe the
              firestopping application for compliance with project drawings,
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

            {formData.inspectionOutcome === "NON_CONFORMANCE" && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">NON-CONFORMANCE NOTES:</h3>
                <textarea
                  name="nonConformanceNotes"
                  value={formData.nonConformanceNotes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Enter non-conformance notes"
                />
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">
              CHECKLIST (Please check all applicable):
            </h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Requirements</th>
                  <th className="border p-2 w-16 text-center">YES</th>
                  <th className="border p-2 w-16 text-center">NO</th>
                  <th className="border p-2 w-16 text-center">N/A</th>
                  <th className="border p-2">Inspection Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    a) Is firestopping material used approved?
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="firestoppingMaterialApproved"
                      value="YES"
                      checked={
                        formData.checklist.firestoppingMaterialApproved
                          .status === "YES"
                      }
                      onChange={(e) =>
                        handleChecklistChange(
                          "firestoppingMaterialApproved",
                          "status",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="firestoppingMaterialApproved"
                      value="NO"
                      checked={
                        formData.checklist.firestoppingMaterialApproved
                          .status === "NO"
                      }
                      onChange={(e) =>
                        handleChecklistChange(
                          "firestoppingMaterialApproved",
                          "status",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="firestoppingMaterialApproved"
                      value="N/A"
                      checked={
                        formData.checklist.firestoppingMaterialApproved
                          .status === "N/A"
                      }
                      onChange={(e) =>
                        handleChecklistChange(
                          "firestoppingMaterialApproved",
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
                        formData.checklist.firestoppingMaterialApproved.details
                      }
                      onChange={(e) =>
                        handleChecklistChange(
                          "firestoppingMaterialApproved",
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
                    b) Are all penetrations or areas that require firestopping
                    sealed properly?
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="penetrationsProperlySealed"
                      value="YES"
                      checked={
                        formData.checklist.penetrationsProperlySealed.status ===
                        "YES"
                      }
                      onChange={(e) =>
                        handleChecklistChange(
                          "penetrationsProperlySealed",
                          "status",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="penetrationsProperlySealed"
                      value="NO"
                      checked={
                        formData.checklist.penetrationsProperlySealed.status ===
                        "NO"
                      }
                      onChange={(e) =>
                        handleChecklistChange(
                          "penetrationsProperlySealed",
                          "status",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name="penetrationsProperlySealed"
                      value="N/A"
                      checked={
                        formData.checklist.penetrationsProperlySealed.status ===
                        "N/A"
                      }
                      onChange={(e) =>
                        handleChecklistChange(
                          "penetrationsProperlySealed",
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
                        formData.checklist.penetrationsProperlySealed.details
                      }
                      onChange={(e) =>
                        handleChecklistChange(
                          "penetrationsProperlySealed",
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
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>

          {/* Inspector's Signature */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Inspector&apos;s Signature</h3>
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
            <div className="space-y-4">
              {formData.photographs.map((photo, index) => (
                <div key={index} className="border p-4 rounded">
                  <div className="mb-2">
                    {photo.image && (
                      <div className="relative aspect-w-4 aspect-h-3 mb-2">
                        <img
                          src={photo.image}
                          alt={photo.caption}
                          className="object-cover w-full h-48"
                        />
                      </div>
                    )}
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
                className="bg-[#0066A1] text-white px-4 py-2 rounded hover:bg-[#004d7a] transition-colors"
              >
                Add Photo
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0066A1] text-white py-2 px-4 rounded hover:bg-[#004d7a] transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
