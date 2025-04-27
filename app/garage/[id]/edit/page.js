"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function EditGarageReport() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
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

  const [previewUrl, setPreviewUrl] = useState(null);

  const locationMapInputRef = useRef();
  const parkingOverlayInputRef = useRef();
  const photographInputRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/garage/${params.id}`);
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

        // Set location map
        if (data.locationMap) {
          setLocationMap(data.locationMap);
          setLocationMapPreview(data.locationMap);
        } else {
          setLocationMap(null);
          setLocationMapPreview(null);
        }

        // Set parking overlay images
        if (
          data.parkingOverlayImages &&
          Array.isArray(data.parkingOverlayImages)
        ) {
          setParkingOverlayImages(data.parkingOverlayImages);
          setParkingOverlayPreviews(data.parkingOverlayImages);
        } else {
          setParkingOverlayImages([]);
          setParkingOverlayPreviews([]);
        }

        // Set report structure answers
        if (
          data.reportStructureAnswers &&
          Array.isArray(data.reportStructureAnswers)
        ) {
          setReportStructureAnswers(data.reportStructureAnswers);
        } else {
          setReportStructureAnswers(["", "", "", "", "", "", "", ""]);
        }

        // Set photographs
        if (data.photographs && Array.isArray(data.photographs)) {
          setPhotographs(data.photographs);
          setPhotographPreviews(
            data.photographs.map((photo) => (photo.file ? photo.file : photo))
          );
        } else {
          setPhotographs([]);
          setPhotographPreviews([]);
        }

        // Set remarks
        if (data.remarks && Array.isArray(data.remarks)) {
          setRemarks(data.remarks);
        } else {
          setRemarks([{ id: 1, text: "" }]);
        }
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

  const handleLocationMapUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocationMap(file);
      setLocationMapPreview(URL.createObjectURL(file));
    }
  };

  const handleParkingOverlayUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setParkingOverlayImages((prev) => [...prev, ...newFiles]);
      setParkingOverlayPreviews((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleReportStructureAnswer = (e) => {
    const { name, value } = e.target;
    setReportStructureAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotographUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setPhotographs((prev) => [
        ...prev,
        ...newFiles.map((file) => ({ file, description: "" })),
      ]);
      setPhotographPreviews((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemarksChange = (index, value) => {
    setRemarks((prev) =>
      prev.map((remark, i) =>
        i === index ? { ...remark, text: value } : remark
      )
    );
  };

  const handleAddRemark = () => {
    setRemarks((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert location map to base64 if it's a File object
      let locationMapBase64 = locationMap;
      if (locationMap instanceof File) {
        locationMapBase64 = await convertToBase64(locationMap);
      }
      // Convert parking overlay images to base64 if they're File objects
      const parkingOverlayImagesBase64 = await Promise.all(
        parkingOverlayImages.map(async (img) =>
          img instanceof File ? await convertToBase64(img) : img
        )
      );
      // Convert photographs to base64 if their file is a File object
      const photographsBase64 = await Promise.all(
        photographs.map(async (photo) => {
          if (photo.file instanceof File) {
            return {
              file: await convertToBase64(photo.file),
              description: photo.description || "",
            };
          }
          // If already base64 or url
          return {
            file: photo.file || photo,
            description: photo.description || "",
          };
        })
      );
      // Remarks as array of objects
      const remarksObj = remarks.map((r) => ({ id: r.id, text: r.text }));
      const updatedFormData = {
        ...formData,
        locationMap: locationMapBase64,
        parkingOverlayImages: parkingOverlayImagesBase64,
        reportStructureAnswers,
        photographs: photographsBase64,
        remarks: remarksObj,
      };
      const response = await fetch(`/api/garage/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });
      if (!response.ok) throw new Error("Failed to update report");
      toast.success("Report updated successfully");
      router.push("/dashboard");
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

  function handleRemoveParkingOverlayImage(index) {
    setParkingOverlayImages((prev) => prev.filter((_, i) => i !== index));
    setParkingOverlayPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function handleRemovePhotograph(index) {
    setPhotographs((prev) => prev.filter((_, i) => i !== index));
    setPhotographPreviews((prev) => prev.filter((_, i) => i !== index));
  }

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
          <h2 className="text-2xl font-bold text-center border-t border-b border-gray-300 py-4 mb-8">
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

          {/* ATTN Section */}
          <div className="px-10 mb-6">
            <h3 className="font-bold mb-2">ATTN</h3>
            <input
              type="text"
              name="attnName"
              value={formData.attnName}
              onChange={handleInputChange}
              placeholder="Name"
              className="mb-2 w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="attnCompany"
              value={formData.attnCompany}
              onChange={handleInputChange}
              placeholder="Company"
              className="mb-2 w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="attnAddress"
              value={formData.attnAddress}
              onChange={handleInputChange}
              placeholder="Address"
              className="mb-2 w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              name="attnEmail"
              value={formData.attnEmail}
              onChange={handleInputChange}
              placeholder="Email"
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
              placeholder="RE"
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
              placeholder="Application Body"
              className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500 whitespace-pre-line"
              rows={4}
            />
          </div>

          {/* Location Map Section */}
          <div className="px-10 mb-6">
            <div className="flex flex-col items-center gap-6">
              <div className="w-full">
                <h2 className="text-2xl font-extrabold underline text-center mb-8 mt-8 tracking-wide">
                  LOCATION MAP
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocationMapUpload}
                  className="mb-2 hidden"
                  ref={locationMapInputRef}
                />
                {locationMapPreview && (
                  <div className="flex flex-col items-center relative">
                    <Image
                      src={locationMapPreview}
                      alt="Location Map"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-auto h-auto max-w-full"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                      onClick={() => {
                        setLocationMap(null);
                        setLocationMapPreview(null);
                      }}
                      aria-label="Remove Location Map"
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                )}
                {!locationMapPreview && (
                  <button
                    type="button"
                    className="flex items-center gap-2 mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    onClick={() => locationMapInputRef.current.click()}
                  >
                    <PlusIcon className="h-5 w-5" /> Add Location Map
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Building Details Section */}
          <div className="px-10 mb-10">
            <h2 className="text-2xl font-extrabold underline text-center mb-8 mt-8 tracking-wide">
              BUILDING DETAILS
            </h2>
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
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Block No.:</label>
                <input
                  type="text"
                  name="blockNo"
                  value={formData.blockNo}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Lot No.:</label>
                <input
                  type="text"
                  name="lotNo"
                  value={formData.lotNo}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">BIN:</label>
                <input
                  type="text"
                  name="bin"
                  value={formData.bin}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Landmark Status:</label>
                <input
                  type="text"
                  name="landmarkStatus"
                  value={formData.landmarkStatus}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Community Board:</label>
                <input
                  type="text"
                  name="communityBoard"
                  value={formData.communityBoard}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
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
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Lot Size:</label>
                <input
                  type="text"
                  name="lotSize"
                  value={formData.lotSize}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Gross Floor Area:</label>
                <input
                  type="text"
                  name="grossFloorArea"
                  value={formData.grossFloorArea}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Usage:</label>
                <input
                  type="text"
                  name="usage"
                  value={formData.usage}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Zoning:</label>
                <input
                  type="text"
                  name="zoning"
                  value={formData.zoning}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Zoning Map #:</label>
                <input
                  type="text"
                  name="zoningMapNo"
                  value={formData.zoningMapNo}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Year built:</label>
                <input
                  type="text"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
                <label className="font-medium">Construction:</label>
                <input
                  type="text"
                  name="construction"
                  value={formData.construction}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Parking Overlay Section */}
          <div className="px-10 mb-6">
            <div className="flex flex-col items-center gap-6">
              <div className="w-full">
                <h2 className="text-2xl font-extrabold underline text-center mb-8 mt-8 tracking-wide">
                  PARKING OVERLAY IMAGES:
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleParkingOverlayUpload}
                  className="mb-2 hidden"
                  ref={parkingOverlayInputRef}
                  multiple
                />
                {parkingOverlayPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center mb-6 w-full relative"
                  >
                    <Image
                      src={preview}
                      alt={`Parking Overlay ${index + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-auto h-auto max-w-full"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                      onClick={() => handleRemoveParkingOverlayImage(index)}
                      aria-label="Remove Parking Overlay Image"
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-2 mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  onClick={() => parkingOverlayInputRef.current.click()}
                >
                  <PlusIcon className="h-5 w-5" /> Add Image
                </button>
              </div>
            </div>
          </div>

          {/* Report on Parking Structure Section */}
          <div className="px-10 mb-10">
            <h2 className="text-2xl font-extrabold underline text-center mb-8 mt-8 tracking-wide">
              REPORT ON PARKING STRUCTURE:
            </h2>
            <div className="space-y-8">
              {[
                "Was a comprehensive inspection of the entire parking structure conducted, including structural components, waterproofing systems, fireproofing and fire-stopping systems, and wearing surfaces, as well as areas directly above or below the structure?",
                "Was a physical assessment performed for the purpose of this initial observation report?",
                "Were any SREM (Significant Repairs and Emergency Maintenance) conditions identified?",
                "If SREM conditions were found, is it likely they will become unsafe before the next compliance report is due?",
                "Were any unsafe conditions identified?",
                "Was the Department of Buildings and the building owner notified of any unsafe conditions?",
                "Were public safety measures required?",
                "Were public safety measures implemented?",
              ].map((question, idx) => (
                <div key={idx}>
                  <div className="font-medium">{question}</div>
                  <input
                    type="text"
                    name={`reportStructureAnswer${idx}`}
                    value={reportStructureAnswers[idx] || ""}
                    onChange={(e) => {
                      const newAnswers = [...reportStructureAnswers];
                      newAnswers[idx] = e.target.value;
                      setReportStructureAnswers(newAnswers);
                    }}
                    className="mt-2 font-bold w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Photographs Section */}
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl font-bold underline mb-4 text-center">
              PHOTOGRAPHS
            </h2>
            <div className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotographUpload}
                className="mb-2 hidden"
                ref={photographInputRef}
                multiple
              />
              {photographPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center mb-6 w-full relative"
                >
                  <Image
                    src={preview}
                    alt={`Photograph ${index + 1}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto h-auto max-w-full"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                    onClick={() => handleRemovePhotograph(index)}
                    aria-label="Remove Photograph"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                  <div className="mt-4 text-center w-full">
                    <input
                      type="text"
                      placeholder="Description"
                      value={photographs[index]?.description || ""}
                      onChange={(e) => {
                        const newPhotos = [...photographs];
                        newPhotos[index] = {
                          ...(typeof newPhotos[index] === "object"
                            ? newPhotos[index]
                            : { file: newPhotos[index] }),
                          description: e.target.value,
                        };
                        setPhotographs(newPhotos);
                      }}
                      className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500 text-center"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="flex items-center gap-2 mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                onClick={() => photographInputRef.current.click()}
              >
                <PlusIcon className="h-5 w-5" /> Add Image
              </button>
            </div>
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
                      className="ml-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                      onClick={() =>
                        setRemarks((prev) => prev.filter((_, i) => i !== index))
                      }
                      aria-label="Delete Remark"
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={remark.text}
                    onChange={(e) => handleRemarksChange(index, e.target.value)}
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
              <button
                type="button"
                className="flex items-center gap-2 mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                onClick={handleAddRemark}
              >
                <PlusIcon className="h-5 w-5" /> Add Remark
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Link
            href={`/garage/${params.id}`}
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
