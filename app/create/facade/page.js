"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function CreateFacadeReport() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: "",
    projectAddress: "",
    client: "",
    date: "",
    siteInspector: "",
    inspectorImage: null,
    inspectionItems: {},
    buildingAddress: "",
    blockNo: "",
    lotNo: "",
    bin: "",
    landmarkStatus: "",
    communityBoard: "",
    numberOfStories: "",
    lotSize: "",
    grossFloorArea: "",
    usage: "",
    zoning: "",
    zoningMapNo: "",
    yearBuilt: "",
    construction: "",
    observations: [
      {
        id: 1,
        text: "",
      },
    ],
    images: [
      {
        id: 1,
        file: null,
        description: "",
      },
    ],
    structuralDesignImages: [
      {
        id: 1,
        file: null,
        description: "",
      },
    ],
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState({});
  const [structuralDesignPreviewUrls, setStructuralDesignPreviewUrls] =
    useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        inspectorImage: file,
      }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.projectName.trim()) {
        throw new Error("Project name is required");
      }
      if (!formData.projectAddress.trim()) {
        throw new Error("Project address is required");
      }
      if (!formData.client.trim()) {
        throw new Error("Client is required");
      }
      if (!formData.date) {
        throw new Error("Date is required");
      }
      if (!formData.siteInspector.trim()) {
        throw new Error("Site inspector is required");
      }

      // Validate observations
      if (formData.observations.length === 0) {
        throw new Error("At least one observation is required");
      }

      // Validate images
      if (formData.images.length === 0) {
        throw new Error("At least one image is required");
      }

      // Convert inspector image to base64
      let inspectorImageBase64 = null;
      if (formData.inspectorImage) {
        inspectorImageBase64 = await convertFileToBase64(
          formData.inspectorImage
        );
      }

      // Convert regular images to base64
      const imagesPromises = formData.images.map(async (image) => ({
        ...image,
        file: image.file ? await convertFileToBase64(image.file) : null,
      }));
      const imagesWithBase64 = await Promise.all(imagesPromises);

      // Convert structural design images to base64
      const structuralDesignImagesPromises =
        formData.structuralDesignImages.map(async (image) => ({
          ...image,
          file: image.file ? await convertFileToBase64(image.file) : null,
        }));
      const structuralDesignImagesWithBase64 = await Promise.all(
        structuralDesignImagesPromises
      );

      // Create the submission data
      const submissionData = {
        ...formData,
        inspectorImage: inspectorImageBase64,
        images: imagesWithBase64,
        structuralDesignImages: structuralDesignImagesWithBase64,
      };

      // Submit the form
      const response = await fetch("/api/facade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit report");
      }

      toast.success("Report submitted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const addObservation = () => {
    setFormData((prev) => ({
      ...prev,
      observations: [
        ...prev.observations,
        {
          id: prev.observations.length + 1,
          text: "",
        },
      ],
    }));
  };

  const removeObservation = (id) => {
    setFormData((prev) => ({
      ...prev,
      observations: prev.observations.filter((obs) => obs.id !== id),
    }));
  };

  const handleObservationChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      observations: prev.observations.map((obs) =>
        obs.id === id ? { ...obs, text: value } : obs
      ),
    }));
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          id: prev.images.length + 1,
          file: null,
          description: "",
        },
      ],
    }));
  };

  const removeImage = (id) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
    setImagePreviewUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[id];
      return newUrls;
    });
  };

  const handleImageChange = (id, file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.id === id ? { ...img, file } : img
        ),
      }));
      const url = URL.createObjectURL(file);
      setImagePreviewUrls((prev) => ({
        ...prev,
        [id]: url,
      }));
    }
  };

  const handleDescriptionChange = (id, description) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.id === id ? { ...img, description } : img
      ),
    }));
  };

  const addStructuralDesignImage = () => {
    setFormData((prev) => ({
      ...prev,
      structuralDesignImages: [
        ...prev.structuralDesignImages,
        {
          id: prev.structuralDesignImages.length + 1,
          file: null,
          description: "",
        },
      ],
    }));
  };

  const removeStructuralDesignImage = (id) => {
    setFormData((prev) => ({
      ...prev,
      structuralDesignImages: prev.structuralDesignImages.filter(
        (img) => img.id !== id
      ),
    }));
    setStructuralDesignPreviewUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[id];
      return newUrls;
    });
  };

  const handleStructuralDesignImageChange = (id, file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        structuralDesignImages: prev.structuralDesignImages.map((img) =>
          img.id === id ? { ...img, file } : img
        ),
      }));
      const url = URL.createObjectURL(file);
      setStructuralDesignPreviewUrls((prev) => ({
        ...prev,
        [id]: url,
      }));
    }
  };

  const handleStructuralDesignDescriptionChange = (id, description) => {
    setFormData((prev) => ({
      ...prev,
      structuralDesignImages: prev.structuralDesignImages.map((img) =>
        img.id === id ? { ...img, description } : img
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-right mb-4">
        <Link
          href="/dashboard"
          className="text-[#4A90E2] hover:text-[#357ABD] transition-colors text-base inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
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

        {/* Report Title */}
        <h2 className="text-xl font-bold text-center border-t border-b border-gray-300 py-4 mb-8">
          FACADE INSPECTION REPORT
        </h2>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-10">
          <div>
            <label className="font-bold block mb-2">PROJECT NAME:</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold block mb-2">PROJECT ADDRESS:</label>
            <input
              type="text"
              name="projectAddress"
              value={formData.projectAddress}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold block mb-2">CLIENT:</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold block mb-2">DATE:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
            />
          </div>
        </div>

        {/* Site Inspector Section */}
        <div className="px-10 mb-6">
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md">
              <label className="font-bold block mb-2 text-center">
                Site Inspector:
              </label>
              <input
                type="text"
                name="siteInspector"
                value={formData.siteInspector}
                onChange={handleInputChange}
                className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none text-center"
                placeholder="Enter inspector's name"
              />
            </div>
            <div className="flex flex-col items-center">
              {previewUrl ? (
                <div className="mb-4">
                  <Image
                    src={previewUrl}
                    alt="Site Inspector"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto h-auto"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </div>
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="inspector-image"
              />
              <label
                htmlFor="inspector-image"
                className="px-4 py-2 bg-[#4A90E2] text-white rounded cursor-pointer hover:bg-[#357ABD] transition-colors"
              >
                {previewUrl
                  ? "Change Inspector's Image"
                  : "Upload Inspector's Image"}
              </label>
            </div>
          </div>
        </div>

        {/* Building Details Section */}
        <div className="px-10 mb-6">
          <h2 className="text-xl font-bold text-center mb-6">
            Building Details:
          </h2>

          {/* Property Information */}
          <div className="mb-8">
            <h3 className="font-bold mb-4">Property Information</h3>
            <div className="grid grid-cols-[200px,1fr] gap-y-4 items-center">
              <label className="font-normal">Address:</label>
              <input
                type="text"
                name="buildingAddress"
                value={formData.buildingAddress || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                placeholder="e.g., 39-05 29th Street, Long Island City, NY 11101"
              />

              <label className="font-normal">Block No.:</label>
              <input
                type="text"
                name="blockNo"
                value={formData.blockNo || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">Lot No.:</label>
              <input
                type="text"
                name="lotNo"
                value={formData.lotNo || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">BIN:</label>
              <input
                type="text"
                name="bin"
                value={formData.bin || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">Landmark Status:</label>
              <input
                type="text"
                name="landmarkStatus"
                value={formData.landmarkStatus || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">Community Board:</label>
              <input
                type="text"
                name="communityBoard"
                value={formData.communityBoard || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />
            </div>
          </div>

          {/* Building Description */}
          <div>
            <h3 className="font-bold mb-4">Building Description</h3>
            <div className="grid grid-cols-[200px,1fr] gap-y-4 items-center">
              <label className="font-normal">Number of stories:</label>
              <input
                type="text"
                name="numberOfStories"
                value={formData.numberOfStories || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">Lot Size:</label>
              <input
                type="text"
                name="lotSize"
                value={formData.lotSize || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                placeholder="Sq Ft (From NYC ZOLA MAP)"
              />

              <label className="font-normal">Gross Floor Area:</label>
              <input
                type="text"
                name="grossFloorArea"
                value={formData.grossFloorArea || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                placeholder="Sq. Ft"
              />

              <label className="font-normal">Usage:</label>
              <input
                type="text"
                name="usage"
                value={formData.usage || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">Zoning:</label>
              <input
                type="text"
                name="zoning"
                value={formData.zoning || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">Zoning Map #:</label>
              <input
                type="text"
                name="zoningMapNo"
                value={formData.zoningMapNo || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">Year built:</label>
              <input
                type="text"
                name="yearBuilt"
                value={formData.yearBuilt || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />

              <label className="font-normal">Construction:</label>
              <input
                type="text"
                name="construction"
                value={formData.construction || ""}
                onChange={handleInputChange}
                className="border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Structural Design Images Section */}
        <div className="px-10 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">STRUCTURAL DESIGN</h2>
            <button
              type="button"
              onClick={addStructuralDesignImage}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add Structural Design Image
            </button>
          </div>

          <div className="space-y-8">
            {formData.structuralDesignImages.map((image, index) => (
              <div
                key={image.id}
                className="flex flex-col items-center border border-gray-200 rounded-lg p-6 relative"
              >
                <div className="w-full flex justify-between items-center mb-4">
                  <span className="font-bold">Image {index + 1}</span>
                  {formData.structuralDesignImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStructuralDesignImage(image.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4 w-full">
                  {structuralDesignPreviewUrls[image.id] ? (
                    <div className="mb-4">
                      <Image
                        src={structuralDesignPreviewUrls[image.id]}
                        alt={`Structural Design Image ${index + 1}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-auto"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-col items-center gap-4 w-full max-w-md">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleStructuralDesignImageChange(
                          image.id,
                          e.target.files[0]
                        )
                      }
                      className="hidden"
                      id={`structural-design-image-${image.id}`}
                    />
                    <label
                      htmlFor={`structural-design-image-${image.id}`}
                      className="px-4 py-2 bg-[#4A90E2] text-white rounded cursor-pointer hover:bg-[#357ABD] transition-colors"
                    >
                      {structuralDesignPreviewUrls[image.id]
                        ? "Change Image"
                        : "Upload Image"}
                    </label>

                    <textarea
                      value={image.description}
                      onChange={(e) =>
                        handleStructuralDesignDescriptionChange(
                          image.id,
                          e.target.value
                        )
                      }
                      className="w-full border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none min-h-[100px]"
                      placeholder="Enter image description..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observations Section */}
        <div className="px-10 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">OBSERVATIONS</h2>
            <button
              type="button"
              onClick={addObservation}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add Observation
            </button>
          </div>

          <div className="space-y-6">
            {formData.observations.map((observation, index) => (
              <div
                key={observation.id}
                className="border border-gray-200 rounded-lg p-4 relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold">{index + 1}.</span>
                  {formData.observations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObservation(observation.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div>
                  <textarea
                    value={observation.text}
                    onChange={(e) =>
                      handleObservationChange(observation.id, e.target.value)
                    }
                    className="w-full border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none min-h-[100px]"
                    placeholder="Enter observation details..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images Section */}
        <div className="px-10 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">PHOTOGRAPHS</h2>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add Image
            </button>
          </div>

          <div className="space-y-8">
            {formData.images.map((image, index) => (
              <div
                key={image.id}
                className="flex flex-col items-center border border-gray-200 rounded-lg p-6 relative"
              >
                <div className="w-full flex justify-between items-center mb-4">
                  <span className="font-bold">Image {index + 1}</span>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4 w-full">
                  {imagePreviewUrls[image.id] ? (
                    <div className="mb-4">
                      <Image
                        src={imagePreviewUrls[image.id]}
                        alt={`Image ${index + 1}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-auto"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-col items-center gap-4 w-full max-w-md">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(image.id, e.target.files[0])
                      }
                      className="hidden"
                      id={`image-${image.id}`}
                    />
                    <label
                      htmlFor={`image-${image.id}`}
                      className="px-4 py-2 bg-[#4A90E2] text-white rounded cursor-pointer hover:bg-[#357ABD] transition-colors"
                    >
                      {imagePreviewUrls[image.id]
                        ? "Change Image"
                        : "Upload Image"}
                    </label>

                    <textarea
                      value={image.description}
                      onChange={(e) =>
                        handleDescriptionChange(image.id, e.target.value)
                      }
                      className="w-full border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none min-h-[100px]"
                      placeholder="Enter image description..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-10 mb-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </form>
  );
}
