"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function CreateGarageReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectAddress: "",
    client: "",
    date: "",
    attnName: "",
    attnCompany: "",
    attnAddress: "",
    attnEmail: "",
    re: "",
    applicationBody: "",
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
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [locationMap, setLocationMap] = useState(null);
  const [locationMapPreview, setLocationMapPreview] = useState(null);
  const [parkingOverlayImages, setParkingOverlayImages] = useState([]);
  const [parkingOverlayPreviews, setParkingOverlayPreviews] = useState([]);
  const [reportStructureAnswers, setReportStructureAnswers] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [photographs, setPhotographs] = useState([]);
  const [photographPreviews, setPhotographPreviews] = useState([]);

  const [remarks, setRemarks] = useState([{ id: 1, text: "" }]);

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

  const handleLocationMapUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocationMap(file);
      setLocationMapPreview(URL.createObjectURL(file));
    }
  };

  const handleParkingOverlayUpload = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      setParkingOverlayImages((prev) => {
        const updated = [...prev];
        updated[idx] = file;
        return updated;
      });
      setParkingOverlayPreviews((prev) => {
        const updated = [...prev];
        updated[idx] = URL.createObjectURL(file);
        return updated;
      });
    }
  };

  const addParkingOverlayImage = () => {
    setParkingOverlayImages((prev) => [...prev, null]);
    setParkingOverlayPreviews((prev) => [...prev, null]);
  };

  const removeParkingOverlayImage = (idx) => {
    setParkingOverlayImages((prev) => prev.filter((_, i) => i !== idx));
    setParkingOverlayPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReportStructureAnswerChange = (idx, value) => {
    setReportStructureAnswers((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handlePhotographUpload = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      setPhotographs((prev) => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], file };
        return updated;
      });
      setPhotographPreviews((prev) => {
        const updated = [...prev];
        updated[idx] = URL.createObjectURL(file);
        return updated;
      });
    }
  };

  const handlePhotographDescriptionChange = (idx, value) => {
    setPhotographs((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], description: value };
      return updated;
    });
  };

  const addPhotograph = () => {
    setPhotographs((prev) => [...prev, { file: null, description: "" }]);
    setPhotographPreviews((prev) => [...prev, null]);
  };

  const removePhotograph = (idx) => {
    setPhotographs((prev) => prev.filter((_, i) => i !== idx));
    setPhotographPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const addRemark = () => {
    setRemarks((prev) => [...prev, { id: prev.length + 1, text: "" }]);
  };

  const removeRemark = (id) => {
    setRemarks((prev) => prev.filter((remark) => remark.id !== id));
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) =>
      prev.map((remark) =>
        remark.id === id ? { ...remark, text: value } : remark
      )
    );
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

      // Convert location map image to base64 if it's a File object
      let locationMapBase64 = locationMap;
      if (locationMap instanceof File) {
        locationMapBase64 = await convertToBase64(locationMap);
      }

      // Convert parking overlay images to base64
      const parkingOverlayBase64 = await Promise.all(
        parkingOverlayImages.map(async (img) =>
          img instanceof File ? await convertToBase64(img) : img
        )
      );

      // Convert photographs to base64
      const photographsBase64 = await Promise.all(
        photographs.map(async (img) => ({
          ...img,
          file:
            img.file instanceof File
              ? await convertToBase64(img.file)
              : img.file,
        }))
      );

      const submitData = {
        ...formData,
        inspectorImage: inspectorImageBase64,
        locationMap: locationMapBase64,
        parkingOverlayImages: parkingOverlayBase64,
        reportStructureAnswers,
        photographs: photographsBase64,
        remarks,
      };

      const response = await fetch("/api/garage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to create report");
      }

      const data = await response.json();
      toast.success("Report created successfully");
      router.push(`/garage/${data.report._id}`);
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Failed to create report");
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
            GARAGE INSPECTION REPORT
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
                required
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
                required
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
                required
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
                required
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ATTN Section */}
          <div className="px-10 mb-6">
            <h3 className="font-bold mb-2">ATTN</h3>
            <input
              type="text"
              name="attnName"
              value={formData.attnName}
              onChange={handleInputChange}
              placeholder="Recipient Name"
              required
              className="w-full border-b border-gray-300 py-1 mb-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="attnCompany"
              value={formData.attnCompany}
              onChange={handleInputChange}
              placeholder="Company Name"
              required
              className="w-full border-b border-gray-300 py-1 mb-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="attnAddress"
              value={formData.attnAddress}
              onChange={handleInputChange}
              placeholder="Address"
              required
              className="w-full border-b border-gray-300 py-1 mb-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              name="attnEmail"
              value={formData.attnEmail}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* RE Section */}
          <div className="px-10 mb-6">
            <h3 className="font-bold mb-2">RE</h3>
            <input
              type="text"
              name="re"
              value={formData.re}
              onChange={handleInputChange}
              placeholder="Subject/Reference"
              required
              className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Application Body Section */}
          <div className="px-10 mb-6">
            <h3 className="font-bold mb-2">Application Body</h3>
            <textarea
              name="applicationBody"
              value={formData.applicationBody}
              onChange={handleInputChange}
              placeholder="Write the main body of the application here..."
              required
              rows={8}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Location Map Section */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold underline mb-4 text-center">
              Location Map:
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleLocationMapUpload}
              className="mb-4"
            />
            {locationMapPreview && (
              <div className="flex flex-col items-center">
                <Image
                  src={locationMapPreview}
                  alt="Location Map"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-auto max-w-full"
                />
              </div>
            )}
          </div>

          {/* Building Details Section */}
          <div className="px-10 mb-10">
            <h2 className="text-2xl font-extrabold underline text-center mb-8 mt-8 tracking-wide">
              BUILDING DETAILS
            </h2>

            {/* Property Information */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-left">
                Property Information
              </h3>
              <div className="grid grid-cols-[220px,1fr] gap-y-4 items-center">
                <label className="font-medium">Address:</label>
                <input
                  type="text"
                  name="buildingAddress"
                  value={formData.buildingAddress}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Block No.:</label>
                <input
                  type="text"
                  name="blockNo"
                  value={formData.blockNo}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Lot No.:</label>
                <input
                  type="text"
                  name="lotNo"
                  value={formData.lotNo}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">BIN:</label>
                <input
                  type="text"
                  name="bin"
                  value={formData.bin}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Landmark Status:</label>
                <input
                  type="text"
                  name="landmarkStatus"
                  value={formData.landmarkStatus}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Community Board:</label>
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
              <h3 className="font-bold text-lg mb-4 text-left">
                Building Description
              </h3>
              <div className="grid grid-cols-[220px,1fr] gap-y-4 items-center">
                <label className="font-medium">Number of stories:</label>
                <input
                  type="text"
                  name="numberOfStories"
                  value={formData.numberOfStories}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Lot Size:</label>
                <input
                  type="text"
                  name="lotSize"
                  value={formData.lotSize}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Gross Floor Area:</label>
                <input
                  type="text"
                  name="grossFloorArea"
                  value={formData.grossFloorArea}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Usage:</label>
                <input
                  type="text"
                  name="usage"
                  value={formData.usage}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Zoning:</label>
                <input
                  type="text"
                  name="zoning"
                  value={formData.zoning}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Zoning Map #:</label>
                <input
                  type="text"
                  name="zoningMapNo"
                  value={formData.zoningMapNo}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Year built:</label>
                <input
                  type="text"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  className="border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />

                <label className="font-medium">Construction:</label>
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

          {/* Parking Structure Overlay Section */}
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl font-bold underline mb-4 text-center">
              PARKING STRUCTURE OVERLAY
            </h2>
            {parkingOverlayImages.length === 0 && (
              <button
                type="button"
                onClick={addParkingOverlayImage}
                className="mb-4 px-4 py-2 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
              >
                + Add Image
              </button>
            )}
            {parkingOverlayImages.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center mb-6 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleParkingOverlayUpload(e, idx)}
                  className="mb-2"
                />
                {parkingOverlayPreviews[idx] && (
                  <div className="flex flex-col items-center">
                    <Image
                      src={parkingOverlayPreviews[idx]}
                      alt={`Parking Overlay ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-auto h-auto max-w-full"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeParkingOverlayImage(idx)}
                  className="mt-2 text-red-500 hover:text-red-700"
                  title="Remove image"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            ))}
            {parkingOverlayImages.length > 0 && (
              <button
                type="button"
                onClick={addParkingOverlayImage}
                className="mt-2 px-4 py-2 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
              >
                + Add Another Image
              </button>
            )}
          </div>

          {/* Report on Parking Structure Section */}
          <div className="px-10 mb-10">
            <h2 className="text-3xl font-extrabold underline text-center mb-8 mt-8 tracking-wide">
              REPORT ON PARKING STRUCTURE:
            </h2>
            <div className="space-y-8">
              <div>
                <div className="font-medium">
                  Was a comprehensive inspection of the entire parking structure
                  conducted, including structural components, waterproofing
                  systems, fireproofing and fire-stopping systems, and wearing
                  surfaces, as well as areas directly above or below the
                  structure?
                </div>
                <input
                  type="text"
                  value={reportStructureAnswers[0]}
                  onChange={(e) =>
                    handleReportStructureAnswerChange(0, e.target.value)
                  }
                  className="mt-2 w-full border-b border-gray-300 py-1 font-bold focus:outline-none focus:border-blue-500"
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <div className="font-medium">
                  Was a physical assessment performed for the purpose of this
                  initial observation report?
                </div>
                <input
                  type="text"
                  value={reportStructureAnswers[1]}
                  onChange={(e) =>
                    handleReportStructureAnswerChange(1, e.target.value)
                  }
                  className="mt-2 w-full border-b border-gray-300 py-1 font-bold focus:outline-none focus:border-blue-500"
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <div className="font-medium">
                  Were any SREM (Significant Repairs and Emergency Maintenance)
                  conditions identified?
                </div>
                <input
                  type="text"
                  value={reportStructureAnswers[2]}
                  onChange={(e) =>
                    handleReportStructureAnswerChange(2, e.target.value)
                  }
                  className="mt-2 w-full border-b border-gray-300 py-1 font-bold focus:outline-none focus:border-blue-500"
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <div className="font-medium">
                  If SREM conditions were found, is it likely they will become
                  unsafe before the next compliance report is due?
                </div>
                <input
                  type="text"
                  value={reportStructureAnswers[3]}
                  onChange={(e) =>
                    handleReportStructureAnswerChange(3, e.target.value)
                  }
                  className="mt-2 w-full border-b border-gray-300 py-1 font-bold focus:outline-none focus:border-blue-500"
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <div className="font-medium">
                  Were any unsafe conditions identified?
                </div>
                <input
                  type="text"
                  value={reportStructureAnswers[4]}
                  onChange={(e) =>
                    handleReportStructureAnswerChange(4, e.target.value)
                  }
                  className="mt-2 w-full border-b border-gray-300 py-1 font-bold focus:outline-none focus:border-blue-500"
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <div className="font-medium">
                  Was the Department of Buildings and the building owner
                  notified of any unsafe conditions?
                </div>
                <input
                  type="text"
                  value={reportStructureAnswers[5]}
                  onChange={(e) =>
                    handleReportStructureAnswerChange(5, e.target.value)
                  }
                  className="mt-2 w-full border-b border-gray-300 py-1 font-bold focus:outline-none focus:border-blue-500"
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <div className="font-medium">
                  Were public safety measures required?
                </div>
                <input
                  type="text"
                  value={reportStructureAnswers[6]}
                  onChange={(e) =>
                    handleReportStructureAnswerChange(6, e.target.value)
                  }
                  className="mt-2 w-full border-b border-gray-300 py-1 font-bold focus:outline-none focus:border-blue-500"
                  placeholder="Your answer..."
                />
              </div>
              <div>
                <div className="font-medium">
                  Were public safety measures implemented?
                </div>
                <input
                  type="text"
                  value={reportStructureAnswers[7]}
                  onChange={(e) =>
                    handleReportStructureAnswerChange(7, e.target.value)
                  }
                  className="mt-2 w-full border-b border-gray-300 py-1 font-bold focus:outline-none focus:border-blue-500"
                  placeholder="Your answer..."
                />
              </div>
            </div>
          </div>

          {/* Photographs Section */}
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl font-bold underline mb-4 text-center">
              PHOTOGRAPHS
            </h2>
            {photographs.length === 0 && (
              <button
                type="button"
                onClick={addPhotograph}
                className="mb-4 px-4 py-2 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
              >
                + Add Image
              </button>
            )}
            {photographs.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center mb-6 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotographUpload(e, idx)}
                  className="mb-2"
                />
                {photographPreviews[idx] && (
                  <div className="flex flex-col items-center">
                    <Image
                      src={photographPreviews[idx]}
                      alt={`Photograph ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-auto h-auto max-w-full"
                    />
                  </div>
                )}
                <textarea
                  value={img.description}
                  onChange={(e) =>
                    handlePhotographDescriptionChange(idx, e.target.value)
                  }
                  placeholder="Image description"
                  rows={2}
                  className="w-full max-w-lg text-center border border-gray-300 rounded-md p-2 mt-4 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removePhotograph(idx)}
                  className="mt-2 text-red-500 hover:text-red-700"
                  title="Remove image"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            ))}
            {photographs.length > 0 && (
              <button
                type="button"
                onClick={addPhotograph}
                className="mt-2 px-4 py-2 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
              >
                + Add Another Image
              </button>
            )}
          </div>

          {/* Recommendations and Remarks Section */}
          <div className="px-10 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">
              RECOMMENDATIONS AND REMARKS
            </h2>
            <div className="space-y-6">
              {remarks.map((remark, index) => (
                <div
                  key={remark.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{index + 1}.</span>
                    <button
                      type="button"
                      onClick={() => removeRemark(remark.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <textarea
                    value={remark.text}
                    onChange={(e) =>
                      handleRemarkChange(remark.id, e.target.value)
                    }
                    className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addRemark}
                className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500"
              >
                + Add Remark
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
