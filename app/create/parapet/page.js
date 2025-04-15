"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CreateParapetReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationMap, setLocationMap] = useState(null);
  const [locationMapPreview, setLocationMapPreview] = useState(null);
  const [photographs, setPhotographs] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    inspectorName: "",
    inspectionDate: "",
    ownerName: "",
    ownerContactInfo: "",
    parapetConstructionDetails: {
      material: "",
      height: "",
      thickness: "",
    },
    inspectionItems: {
      parapetPlumb: { notes: "" },
      displacement: { notes: "" },
      cracks: { notes: "" },
      missingLooseBricks: { notes: "" },
      missingLooseCopingSegments: { notes: "" },
      missingDeterioratedCopingCaulk: { notes: "" },
      deterioratedMortarJoints: { notes: "" },
      spalling: { notes: "" },
      rot: { notes: "" },
      looseDisturbedFlashing: { notes: "" },
      signsOfWaterPenetration: { notes: "" },
    },
    appurtenances: {
      telecommunicationsEquipment: { notes: "" },
      railings: { notes: "" },
      roofAccessRails: { notes: "" },
      gooseneckLadders: { notes: "" },
      handrailAttachments: { notes: "" },
      signs: { notes: "" },
      cornicesAttached: { notes: "" },
    },
    other: "",
    photographs: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLocationMapChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocationMap(file);
        setLocationMapPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInspectionItemChange = (itemName, value) => {
    setFormData((prev) => ({
      ...prev,
      inspectionItems: {
        ...prev.inspectionItems,
        [itemName]: { notes: value },
      },
    }));
  };

  const handleAppurtenanceChange = (itemName, value) => {
    setFormData((prev) => ({
      ...prev,
      appurtenances: {
        ...prev.appurtenances,
        [itemName]: { notes: value },
      },
    }));
  };

  const handlePhotographUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotographs((prev) => [
          ...prev,
          {
            image: reader.result,
            description: "",
          },
        ]);
        setFormData((prev) => ({
          ...prev,
          photographs: [
            ...prev.photographs,
            {
              image: reader.result,
              description: "",
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photographs: prev.photographs.filter((_, i) => i !== index),
    }));
    setPhotographs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index, description) => {
    setFormData((prev) => ({
      ...prev,
      photographs: prev.photographs.map((photo, i) =>
        i === index ? { ...photo, description } : photo
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, convert the location map to base64
      const locationMapBase64 = locationMapPreview;

      // Create the complete form data
      const completeFormData = {
        ...formData,
        locationMap: locationMapBase64,
      };

      // Submit the form
      const response = await fetch("/api/parapet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      const data = await response.json();
      toast.success("Report created successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to create report");
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleSubmit} className="space-y-8">
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

          {/* Report Title */}
          <h2 className="text-xl font-bold text-center border-b pb-4">
            ANNUAL PARAPET INSPECTION REPORT
          </h2>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-4 border border-gray-300 p-4">
            <div className="space-y-2">
              <div className="flex">
                <label className="w-24 font-semibold">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                  required
                />
              </div>
              <div className="flex">
                <label className="w-24 font-semibold">Inspector:</label>
                <input
                  type="text"
                  name="inspectorName"
                  value={formData.inspectorName}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex">
                <label className="w-24 font-semibold">Date:</label>
                <input
                  type="date"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="grid grid-cols-1 gap-4 border border-gray-300 p-4">
            <div className="flex">
              <label className="w-36 font-semibold">Owner&apos;s Name:</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
            <div className="flex">
              <label className="w-36 font-semibold">
                Owner&apos;s Contact Information:
              </label>
              <input
                type="text"
                name="ownerContactInfo"
                value={formData.ownerContactInfo}
                onChange={handleInputChange}
                className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
          </div>

          {/* Location Map */}
          <div className="border border-gray-300 p-4">
            <h3 className="font-semibold mb-4">Location Map</h3>
            <div className="flex flex-col items-center space-y-4">
              {locationMapPreview ? (
                <div className="relative w-full h-64">
                  <Image
                    src={locationMapPreview}
                    alt="Location Map"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <p className="text-gray-500">No location map uploaded</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLocationMapChange}
                className="hidden"
                id="location-map-input"
                required={!locationMap}
              />
              <label
                htmlFor="location-map-input"
                className="bg-[#0066A1] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#004d7a] transition-colors"
              >
                {locationMap ? "Change Location Map" : "Add Location Map"}
              </label>
            </div>
          </div>

          {/* Parapet Construction Details */}
          <div className="border border-gray-300 p-4">
            <h3 className="font-semibold mb-4">
              Parapet construction details, including material, height, and
              thickness:
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <label className="w-36">Material:</label>
                <input
                  type="text"
                  name="parapetConstructionDetails.material"
                  value={formData.parapetConstructionDetails.material}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                  required
                />
              </div>
              <div className="flex">
                <label className="w-36">Height:</label>
                <input
                  type="text"
                  name="parapetConstructionDetails.height"
                  value={formData.parapetConstructionDetails.height}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                  required
                />
              </div>
              <div className="flex">
                <label className="w-36">Thickness:</label>
                <input
                  type="text"
                  name="parapetConstructionDetails.thickness"
                  value={formData.parapetConstructionDetails.thickness}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Inspection Items Table */}
          <div className="border border-gray-300">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="w-1/3 p-4 text-left font-semibold">Item</th>
                  <th className="w-2/3 p-4 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">Parapet Plumb</p>
                      <p className="text-sm text-gray-600">
                        Check if the parapet is plumb by a horizontal distance
                        within one-eighth of its cross-sectional thickness in
                        any location.
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.inspectionItems.parapetPlumb.notes}
                      onChange={(e) =>
                        handleInspectionItemChange(
                          "parapetPlumb",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Displacement</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.inspectionItems.displacement.notes}
                      onChange={(e) =>
                        handleInspectionItemChange(
                          "displacement",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">
                      Cracks (vertical, horizontal, stepwise)
                    </p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.inspectionItems.cracks.notes}
                      onChange={(e) =>
                        handleInspectionItemChange("cracks", e.target.value)
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                {/* Add remaining inspection items */}
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Missing or loose bricks</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.inspectionItems.missingLooseBricks.notes}
                      onChange={(e) =>
                        handleInspectionItemChange(
                          "missingLooseBricks",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">
                      Missing or loose coping segments/covers
                    </p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={
                        formData.inspectionItems.missingLooseCopingSegments
                          .notes
                      }
                      onChange={(e) =>
                        handleInspectionItemChange(
                          "missingLooseCopingSegments",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">
                      Missing or deteriorated coping caulk
                    </p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={
                        formData.inspectionItems.missingDeterioratedCopingCaulk
                          .notes
                      }
                      onChange={(e) =>
                        handleInspectionItemChange(
                          "missingDeterioratedCopingCaulk",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Deteriorated mortar joints</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={
                        formData.inspectionItems.deterioratedMortarJoints.notes
                      }
                      onChange={(e) =>
                        handleInspectionItemChange(
                          "deterioratedMortarJoints",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Spalling</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.inspectionItems.spalling.notes}
                      onChange={(e) =>
                        handleInspectionItemChange("spalling", e.target.value)
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Rot</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.inspectionItems.rot.notes}
                      onChange={(e) =>
                        handleInspectionItemChange("rot", e.target.value)
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">
                      Loose or otherwise disturbed flashing
                    </p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={
                        formData.inspectionItems.looseDisturbedFlashing.notes
                      }
                      onChange={(e) =>
                        handleInspectionItemChange(
                          "looseDisturbedFlashing",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Signs of water penetration</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={
                        formData.inspectionItems.signsOfWaterPenetration.notes
                      }
                      onChange={(e) =>
                        handleInspectionItemChange(
                          "signsOfWaterPenetration",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Complete Appurtenances Section */}
          <div className="border border-gray-300">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Appurtenances</h3>
              <p className="text-sm text-gray-600">
                Check that appurtenances attached to or supported by the parapet
                are installed and maintained in a stable condition. This
                includes:
              </p>
            </div>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="p-4 w-1/3">
                    <p className="font-semibold">
                      Telecommunications equipment
                    </p>
                  </td>
                  <td className="p-4 w-2/3">
                    <input
                      type="text"
                      value={
                        formData.appurtenances.telecommunicationsEquipment.notes
                      }
                      onChange={(e) =>
                        handleAppurtenanceChange(
                          "telecommunicationsEquipment",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Railings</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.appurtenances.railings.notes}
                      onChange={(e) =>
                        handleAppurtenanceChange("railings", e.target.value)
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Roof access rails</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.appurtenances.roofAccessRails.notes}
                      onChange={(e) =>
                        handleAppurtenanceChange(
                          "roofAccessRails",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Gooseneck ladders</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.appurtenances.gooseneckLadders.notes}
                      onChange={(e) =>
                        handleAppurtenanceChange(
                          "gooseneckLadders",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">
                      Handrail attachments for fire escapes
                    </p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.appurtenances.handrailAttachments.notes}
                      onChange={(e) =>
                        handleAppurtenanceChange(
                          "handrailAttachments",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">Signs</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.appurtenances.signs.notes}
                      onChange={(e) =>
                        handleAppurtenanceChange("signs", e.target.value)
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">
                      Cornices attached to parapet walls
                    </p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={formData.appurtenances.cornicesAttached.notes}
                      onChange={(e) =>
                        handleAppurtenanceChange(
                          "cornicesAttached",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Other Section */}
          <div className="border border-gray-300">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="p-4 w-1/3">
                    <p className="font-semibold">Other</p>
                  </td>
                  <td className="p-4 w-2/3">
                    <input
                      type="text"
                      value={formData.other}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          other: e.target.value,
                        }))
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Photographs Section */}
          <div className="border border-gray-300">
            <div className="p-4 border-b">
              <h3 className="font-semibold">PHOTOGRAPHS:</h3>
            </div>

            <div className="p-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotographUpload}
                className="hidden"
                id="photograph-upload"
              />
              <label
                htmlFor="photograph-upload"
                className="inline-block bg-[#0066A1] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#004d7a] transition-colors"
              >
                Add Image
              </label>

              {formData.photographs.length > 0 && (
                <div className="grid grid-cols-2 gap-6 mt-6">
                  {formData.photographs.map((photo, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 p-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        aria-label="Delete image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                      <div className="aspect-auto mb-4">
                        <img
                          src={photo.image}
                          alt="Uploaded photograph"
                          className="w-full h-auto"
                        />
                      </div>
                      <textarea
                        value={photo.description}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                        placeholder="Enter image description..."
                        className="w-full p-2 border border-gray-300 rounded min-h-[100px] focus:outline-none focus:border-[#0066A1]"
                        required
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0066A1] text-white px-6 py-2 rounded hover:bg-[#004d7a] transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
