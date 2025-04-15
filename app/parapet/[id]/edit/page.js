"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function EditParapetReport() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    address: "",
    inspectorName: "",
    inspectionDate: "",
    ownerName: "",
    ownerContactInfo: "",
    locationMap: "",
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

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/parapet/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setFormData(data);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConstructionDetailChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      parapetConstructionDetails: {
        ...prev.parapetConstructionDetails,
        [field]: value,
      },
    }));
  };

  const handleInspectionItemChange = (item, value) => {
    setFormData((prev) => ({
      ...prev,
      inspectionItems: {
        ...prev.inspectionItems,
        [item]: { notes: value },
      },
    }));
  };

  const handleAppurtenanceChange = (item, value) => {
    setFormData((prev) => ({
      ...prev,
      appurtenances: {
        ...prev.appurtenances,
        [item]: { notes: value },
      },
    }));
  };

  const handleLocationMapChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          locationMap: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotographUpload = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            image: reader.result,
            description: "",
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((newPhotographs) => {
      setFormData((prev) => ({
        ...prev,
        photographs: [...prev.photographs, ...newPhotographs],
      }));
    });
  };

  const handleDeletePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photographs: prev.photographs.filter((_, i) => i !== index),
    }));
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
    try {
      const response = await fetch(`/api/parapet/${params.id}`, {
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
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading report...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-right mb-4">
        <Link
          href="/dashboard"
          className="text-[#0066A1] hover:text-[#004d7a] transition-colors text-base inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white">
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
        <h2 className="text-xl font-bold text-center border-t border-b border-gray-300 py-4 mb-8">
          ANNUAL PARAPET INSPECTION REPORT
        </h2>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="font-semibold block mb-2">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
              required
            />
          </div>
          <div>
            <label className="font-semibold block mb-2">Date:</label>
            <input
              type="date"
              name="inspectionDate"
              value={formData.inspectionDate.split("T")[0]}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
              required
            />
          </div>
          <div>
            <label className="font-semibold block mb-2">Inspector:</label>
            <input
              type="text"
              name="inspectorName"
              value={formData.inspectorName}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
              required
            />
          </div>
        </div>

        {/* Owner Info */}
        <div className="mb-8">
          <div className="mb-4">
            <label className="font-semibold block mb-2">
              Owner&apos;s Name:
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
              required
            />
          </div>
          <div>
            <label className="font-semibold block mb-2">
              Owner&apos;s Contact Information:
            </label>
            <input
              type="text"
              name="ownerContactInfo"
              value={formData.ownerContactInfo}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
              required
            />
          </div>
        </div>

        {/* Location Map */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Location Map</h3>
          <div className="border border-dashed border-gray-300 p-4">
            {formData.locationMap ? (
              <div className="relative">
                <Image
                  src={formData.locationMap}
                  alt="Location Map"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, locationMap: "" }))
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="text-center p-8">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocationMapChange}
                  className="hidden"
                  id="location-map"
                />
                <label
                  htmlFor="location-map"
                  className="bg-[#0066A1] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#004d7a] transition-colors"
                >
                  Add Location Map
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Parapet Construction Details */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">
            Parapet construction details, including material, height, and
            thickness:
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-gray-600 mb-2">Material:</label>
              <input
                type="text"
                value={formData.parapetConstructionDetails.material}
                onChange={(e) =>
                  handleConstructionDetailChange("material", e.target.value)
                }
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Height:</label>
              <input
                type="text"
                value={formData.parapetConstructionDetails.height}
                onChange={(e) =>
                  handleConstructionDetailChange("height", e.target.value)
                }
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Thickness:</label>
              <input
                type="text"
                value={formData.parapetConstructionDetails.thickness}
                onChange={(e) =>
                  handleConstructionDetailChange("thickness", e.target.value)
                }
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
          </div>
        </div>

        {/* Inspection Items */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left font-semibold p-2 w-1/3">Item</th>
                <th className="text-left font-semibold p-2 w-2/3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData.inspectionItems).map(([key, value]) => (
                <tr key={key} className="border-t border-gray-200">
                  <td className="p-2 align-top">
                    {key === "parapetPlumb" ? (
                      <>
                        Parapet Plumb
                        <div className="text-xs text-gray-500 mt-1">
                          Check if the parapet is plumb by a horizontal distance
                          within one-eighth of its cross-sectional thickness in
                          any location.
                        </div>
                      </>
                    ) : (
                      key.split(/(?=[A-Z])/).join(" ")
                    )}
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={value.notes}
                      onChange={(e) =>
                        handleInspectionItemChange(key, e.target.value)
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Appurtenances */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Appurtenances</h3>
          <p className="text-sm text-gray-600 mb-4">
            Check that appurtenances attached to or supported by the parapet are
            installed and maintained in a stable condition. This includes:
          </p>
          <table className="w-full border-collapse">
            <tbody>
              {Object.entries(formData.appurtenances).map(([key, value]) => (
                <tr key={key} className="border-t border-gray-200">
                  <td className="p-2 w-1/3">
                    {key.split(/(?=[A-Z])/).join(" ")}
                  </td>
                  <td className="p-2 w-2/3">
                    <input
                      type="text"
                      value={value.notes}
                      onChange={(e) =>
                        handleAppurtenanceChange(key, e.target.value)
                      }
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Other */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Other</h3>
          <input
            type="text"
            name="other"
            value={formData.other}
            onChange={handleInputChange}
            className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
          />
        </div>

        {/* Photographs */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">PHOTOGRAPHS:</h3>
          <div className="grid grid-cols-2 gap-4">
            {formData.photographs.map((photo, index) => (
              <div key={index} className="relative">
                <Image
                  src={photo.image}
                  alt={`Photograph ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
                <input
                  type="text"
                  value={photo.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  placeholder="Add description"
                  className="mt-2 w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                  required
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
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
              Add Images
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#0066A1] text-white px-8 py-3 rounded hover:bg-[#004d7a] transition-colors"
          >
            Update Report
          </button>
        </div>
      </form>
    </div>
  );
}
