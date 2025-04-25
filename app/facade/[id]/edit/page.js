"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function EditFacadeReport() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/facade/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();

        // Format the date to YYYY-MM-DD for the input type="date"
        const formattedData = {
          ...data,
          date: data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : "",
        };

        // Set form data
        setFormData(formattedData);

        // Set preview URLs for images
        if (data.inspectorImage) {
          setPreviewUrl(data.inspectorImage);
        }

        // Set preview URLs for regular images
        const imgUrls = {};
        data.images.forEach((img) => {
          if (img.file) {
            imgUrls[img.id] = img.file;
          }
        });
        setImagePreviewUrls(imgUrls);

        // Set preview URLs for structural design images
        const structuralUrls = {};
        data.structuralDesignImages.forEach((img) => {
          if (img.file) {
            structuralUrls[img.id] = img.file;
          }
        });
        setStructuralDesignPreviewUrls(structuralUrls);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert inspector image to base64 if it's a File object
      let inspectorImageBase64 = formData.inspectorImage;
      if (formData.inspectorImage instanceof File) {
        inspectorImageBase64 = await convertToBase64(formData.inspectorImage);
      }

      // Convert regular images to base64
      const processedImages = await Promise.all(
        formData.images.map(async (img) => ({
          ...img,
          file:
            img.file instanceof File
              ? await convertToBase64(img.file)
              : img.file,
        }))
      );

      // Convert structural design images to base64
      const processedStructuralImages = await Promise.all(
        formData.structuralDesignImages.map(async (img) => ({
          ...img,
          file:
            img.file instanceof File
              ? await convertToBase64(img.file)
              : img.file,
        }))
      );

      const updatedFormData = {
        ...formData,
        inspectorImage: inspectorImageBase64,
        images: processedImages,
        structuralDesignImages: processedStructuralImages,
      };

      const response = await fetch(`/api/facade/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to update report");
      }

      toast.success("Report updated successfully");
      router.push(`/facade/${params.id}`);
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report");
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link
          href={`/dashboard`}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
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
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold block mb-2">PROJECT ADDRESS:</label>
              <input
                type="text"
                name="projectAddress"
                value={formData.projectAddress}
                onChange={handleInputChange}
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold block mb-2">CLIENT:</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold block mb-2">DATE:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
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
                  className="w-full text-center border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                {previewUrl && (
                  <div className="flex flex-col items-center">
                    <Image
                      src={previewUrl}
                      alt="Site Inspector"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-auto h-auto max-w-full"
                    />
                  </div>
                )}
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
                  value={formData.buildingAddress}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Block No.:</label>
                <input
                  type="text"
                  name="blockNo"
                  value={formData.blockNo}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Lot No.:</label>
                <input
                  type="text"
                  name="lotNo"
                  value={formData.lotNo}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">BIN:</label>
                <input
                  type="text"
                  name="bin"
                  value={formData.bin}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Landmark Status:</label>
                <input
                  type="text"
                  name="landmarkStatus"
                  value={formData.landmarkStatus}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Community Board:</label>
                <input
                  type="text"
                  name="communityBoard"
                  value={formData.communityBoard}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
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
                  value={formData.numberOfStories}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Lot Size:</label>
                <input
                  type="text"
                  name="lotSize"
                  value={formData.lotSize}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Gross Floor Area:</label>
                <input
                  type="text"
                  name="grossFloorArea"
                  value={formData.grossFloorArea}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Usage:</label>
                <input
                  type="text"
                  name="usage"
                  value={formData.usage}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Zoning:</label>
                <input
                  type="text"
                  name="zoning"
                  value={formData.zoning}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Zoning Map #:</label>
                <input
                  type="text"
                  name="zoningMapNo"
                  value={formData.zoningMapNo}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Year built:</label>
                <input
                  type="text"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-normal">Construction:</label>
                <input
                  type="text"
                  name="construction"
                  value={formData.construction}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Structural Design Images Section */}
          <div className="px-10 mb-6">
            <h2 className="text-xl font-bold mb-6">STRUCTURAL DESIGN</h2>
            <div className="space-y-8">
              {formData.structuralDesignImages.map((image, index) => (
                <div
                  key={image.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="mb-4 flex justify-between items-center">
                    <span className="font-bold">Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeStructuralDesignImage(image.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleStructuralDesignImageChange(
                        image.id,
                        e.target.files[0]
                      )
                    }
                    className="mb-2"
                  />
                  {structuralDesignPreviewUrls[image.id] && (
                    <div className="mb-4 flex flex-col items-center">
                      <Image
                        src={structuralDesignPreviewUrls[image.id]}
                        alt={image.description || "Structural design image"}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-auto max-w-full"
                      />
                    </div>
                  )}
                  <div className="mt-4">
                    <textarea
                      value={image.description}
                      onChange={(e) =>
                        handleStructuralDesignDescriptionChange(
                          image.id,
                          e.target.value
                        )
                      }
                      placeholder="Image description"
                      className="w-full text-center border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addStructuralDesignImage}
                className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Structural Design Image
              </button>
            </div>
          </div>

          {/* Observations Section */}
          <div className="px-10 mb-6">
            <h2 className="text-xl font-bold mb-6">OBSERVATIONS</h2>
            <div className="space-y-6">
              {formData.observations.map((observation, index) => (
                <div
                  key={observation.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{index + 1}.</span>
                    <button
                      type="button"
                      onClick={() => removeObservation(observation.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <textarea
                    value={observation.text}
                    onChange={(e) =>
                      handleObservationChange(observation.id, e.target.value)
                    }
                    className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addObservation}
                className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Observation
              </button>
            </div>
          </div>

          {/* Images Section */}
          <div className="px-10 mb-6">
            <h2 className="text-xl font-bold mb-6">PHOTOGRAPHS</h2>
            <div className="space-y-8">
              {formData.images.map((image, index) => (
                <div
                  key={image.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="mb-4 flex justify-between items-center">
                    <span className="font-bold">Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(image.id, e.target.files[0])
                    }
                    className="mb-2"
                  />
                  {imagePreviewUrls[image.id] && (
                    <div className="mb-4 flex flex-col items-center">
                      <Image
                        src={imagePreviewUrls[image.id]}
                        alt={image.description || "Report image"}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-auto max-w-full"
                      />
                    </div>
                  )}
                  <div className="mt-4">
                    <textarea
                      value={image.description}
                      onChange={(e) =>
                        handleDescriptionChange(image.id, e.target.value)
                      }
                      placeholder="Image description"
                      className="w-full text-center border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addImage}
                className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Image
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Link
            href={`/facade/${params.id}`}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
