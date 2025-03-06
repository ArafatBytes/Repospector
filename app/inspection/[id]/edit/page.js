"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function InspectionEdit() {
  const router = useRouter();
  const params = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageOptions, setShowImageOptions] = useState(false);

  useEffect(() => {
    async function fetchInspection() {
      if (!params?.id) return;

      try {
        const response = await fetch(`/api/inspections/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch inspection");
        }
        const data = await response.json();
        setInspection(data);
      } catch (error) {
        console.error("Error fetching inspection:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInspection();
  }, [params?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting inspection data:", inspection);
      const response = await fetch(`/api/inspections/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inspection),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error(`Failed to update inspection: ${errorData}`);
      }

      const result = await response.json();
      console.log("Update successful:", result);

      // Show success toast
      toast.success("Inspection updated successfully!");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating inspection:", error);
      toast.error("Failed to update inspection. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setInspection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setInspection((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleRadioChange = (section, field, type) => {
    setInspection((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          approved: type === "approved",
          disapproved: type === "disapproved",
          notApplicable: type === "notApplicable",
        },
      },
    }));
  };

  const handleEnergyCodeComplianceChange = (field, type, value) => {
    setInspection((prev) => ({
      ...prev,
      energyCodeCompliance: {
        ...prev.energyCodeCompliance,
        [field]: {
          ...prev.energyCodeCompliance[field],
          [type]: value,
        },
      },
    }));
  };

  const handleImageCapture = async () => {
    try {
      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback for browsers that don't support getUserMedia
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.setAttribute("capture", "camera");

        input.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            processImageFile(file);
          }
        });

        input.click();
        return;
      }

      // Create UI elements for camera preview
      const videoContainer = document.createElement("div");
      videoContainer.style.position = "fixed";
      videoContainer.style.top = "0";
      videoContainer.style.left = "0";
      videoContainer.style.width = "100%";
      videoContainer.style.height = "100%";
      videoContainer.style.backgroundColor = "rgba(0,0,0,0.8)";
      videoContainer.style.zIndex = "9999";
      videoContainer.style.display = "flex";
      videoContainer.style.flexDirection = "column";
      videoContainer.style.alignItems = "center";
      videoContainer.style.justifyContent = "center";

      const video = document.createElement("video");
      video.style.maxWidth = "100%";
      video.style.maxHeight = "80%";
      video.style.backgroundColor = "#000";
      video.autoplay = true;
      video.playsInline = true; // Important for iOS

      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.marginTop = "20px";
      buttonContainer.style.gap = "10px";

      const captureButton = document.createElement("button");
      captureButton.textContent = "Capture";
      captureButton.style.padding = "10px 20px";
      captureButton.style.backgroundColor = "#4A90E2";
      captureButton.style.color = "white";
      captureButton.style.border = "none";
      captureButton.style.borderRadius = "5px";
      captureButton.style.cursor = "pointer";

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.style.padding = "10px 20px";
      cancelButton.style.backgroundColor = "#f44336";
      cancelButton.style.color = "white";
      cancelButton.style.border = "none";
      cancelButton.style.borderRadius = "5px";
      cancelButton.style.cursor = "pointer";

      buttonContainer.appendChild(captureButton);
      buttonContainer.appendChild(cancelButton);

      videoContainer.appendChild(video);
      videoContainer.appendChild(buttonContainer);

      document.body.appendChild(videoContainer);

      // Get access to the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // Connect the stream to the video element
      video.srcObject = stream;

      // Set up event handlers
      const cleanup = () => {
        // Stop all tracks in the stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        // Remove the video container from the DOM
        if (videoContainer && videoContainer.parentNode) {
          videoContainer.parentNode.removeChild(videoContainer);
        }
      };

      cancelButton.addEventListener("click", () => {
        cleanup();
      });

      captureButton.addEventListener("click", () => {
        // Create a canvas to capture the current video frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg");

        // Add the image to inspection data
        setInspection((prev) => {
          const currentImages = Array.isArray(prev.images) ? prev.images : [];
          return {
            ...prev,
            images: [
              ...currentImages,
              {
                urls: [imageDataUrl],
                comment: "",
              },
            ],
          };
        });

        // Clean up
        cleanup();

        // Hide options
        setShowImageOptions(false);
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Error accessing camera. Please check camera permissions.");

      // Fallback to file input if camera access fails
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          processImageFile(file);
        }
      });

      input.click();
    }
  };

  // Helper function to process image files
  const processImageFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setInspection((prev) => {
        const currentImages = Array.isArray(prev.images) ? prev.images : [];
        return {
          ...prev,
          images: [
            ...currentImages,
            {
              urls: [reader.result],
              comment: "",
            },
          ],
        };
      });

      // Hide options
      setShowImageOptions(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A90E2]"></div>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Inspection not found</h1>
        <Link
          href="/dashboard"
          className="text-[#4A90E2] hover:underline flex items-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
      </div>
    );
  }

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
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.jpg"
            alt="SHAHRISH"
            width={300}
            height={100}
            priority
          />
        </div>

        {/* Header */}
        <div className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-xl font-medium">
          Special Inspection Report
        </div>

        <div className="p-6">
          {/* Report Type */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">REPORT:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={inspection.reportType === "PROGRESS"}
                    onChange={() => handleInputChange("reportType", "PROGRESS")}
                    className="form-radio"
                  />
                  <span>PROGRESS</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={inspection.reportType === "FINAL"}
                    onChange={() => handleInputChange("reportType", "FINAL")}
                    className="form-radio"
                  />
                  <span>FINAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date:</label>
              <input
                type="date"
                value={
                  inspection.date
                    ? new Date(inspection.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client:
                </label>
                <input
                  type="text"
                  value={inspection.client || ""}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  SSE Project #:
                </label>
                <input
                  type="text"
                  value={inspection.amaaProjectNumber || ""}
                  onChange={(e) =>
                    handleInputChange("amaaProjectNumber", e.target.value)
                  }
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                City/County Of:
              </label>
              <input
                type="text"
                value={inspection.cityCounty || ""}
                onChange={(e) =>
                  handleInputChange("cityCounty", e.target.value)
                }
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sent To:</label>
              <input
                type="text"
                value={inspection.sentTo || ""}
                onChange={(e) => handleInputChange("sentTo", e.target.value)}
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Project Name:
              </label>
              <input
                type="text"
                value={inspection.projectName || ""}
                onChange={(e) =>
                  handleInputChange("projectName", e.target.value)
                }
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address:</label>
              <input
                type="text"
                value={inspection.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time Arrived:
                </label>
                <input
                  type="time"
                  value={inspection.timeArrived || ""}
                  onChange={(e) =>
                    handleInputChange("timeArrived", e.target.value)
                  }
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time Departed:
                </label>
                <input
                  type="time"
                  value={inspection.timeDeparted || ""}
                  onChange={(e) =>
                    handleInputChange("timeDeparted", e.target.value)
                  }
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Floor:</label>
              <input
                type="text"
                value={inspection.floor || ""}
                onChange={(e) => handleInputChange("floor", e.target.value)}
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Person(s) Met With:
              </label>
              <input
                type="text"
                value={inspection.personsMet || ""}
                onChange={(e) =>
                  handleInputChange("personsMet", e.target.value)
                }
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                DOB Application #:
              </label>
              <input
                type="text"
                value={inspection.dobApplication || ""}
                onChange={(e) =>
                  handleInputChange("dobApplication", e.target.value)
                }
                className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notice Text */}
          <div className="col-span-2 mt-8">
            <div className="text-sm text-gray-600 mb-6">
              In accordance with applicable sections of the New York City
              Building Code (BC) of 2014, special inspections have been provided
              for the following items:
            </div>

            <div className="grid grid-cols-[1fr,auto,auto] gap-4 mb-2">
              <div className="font-medium">Inspection Item</div>
              <div className="font-medium text-center w-20">Approved</div>
              <div className="font-medium text-center w-24">See Comments</div>
            </div>

            {[
              {
                name: "Structural Steel – Welding, as per BC 1705.2.1",
                key: "structuralSteelWelding",
              },
              {
                name: "Structural Steel – Details, as per BC 1705.2.2",
                key: "structuralSteelDetails",
              },
              {
                name: "Structural Steel – High Strength Bolting, as per BC 1705.2.3",
                key: "structuralSteelBolting",
              },
              {
                name: "Mechanical Systems, as per BC 1705.21",
                key: "mechanicalSystems",
              },
              {
                name: "Sprinkler Systems, as per BC 1705.29",
                key: "sprinklerSystems",
              },
              {
                name: "Heating Systems, as per BC 1705.31",
                key: "heatingSystems",
              },
              {
                name: "Fire-Resistant Penetrations and Joints, as per BC 1705.17",
                key: "fireResistantPenetrations",
              },
              {
                name: "Post-Installed Anchors (BB# 2014-018, 2014-019), as per BC 1705.37",
                key: "postInstalledAnchors",
              },
              {
                name: "Energy Code Compliance, as per BC 110.3.5",
                key: "energyCodeCompliance",
              },
              {
                name: "Fire-Resistance Rated Construction, as per BC 110.3.4",
                key: "fireResistanceRated",
              },
              {
                name: "Final Inspection, as per BC 28-116.2.4.2 and Directive 14 of 1975",
                key: "finalInspection",
              },
            ].map((item) => {
              const inspectionItem = inspection.inspectionItems?.find(
                (i) => i.name === item.name
              );
              return (
                <div
                  key={item.key}
                  className="grid grid-cols-[1fr,auto,auto] gap-4 items-center py-1 border-b border-gray-200"
                >
                  <div className="text-sm">{item.name}</div>
                  <div className="flex justify-center w-20">
                    <input
                      type="checkbox"
                      checked={inspectionItem?.approved || false}
                      onChange={(e) => {
                        const updatedItems = [
                          ...(inspection.inspectionItems || []),
                        ];
                        const existingIndex = updatedItems.findIndex(
                          (i) => i.name === item.name
                        );
                        if (existingIndex >= 0) {
                          updatedItems[existingIndex] = {
                            ...updatedItems[existingIndex],
                            approved: e.target.checked,
                          };
                        } else {
                          updatedItems.push({
                            name: item.name,
                            approved: e.target.checked,
                            seeComments: false,
                          });
                        }
                        handleInputChange("inspectionItems", updatedItems);
                      }}
                      className="form-checkbox"
                    />
                  </div>
                  <div className="flex justify-center w-24">
                    <input
                      type="checkbox"
                      checked={inspectionItem?.seeComments || false}
                      onChange={(e) => {
                        const updatedItems = [
                          ...(inspection.inspectionItems || []),
                        ];
                        const existingIndex = updatedItems.findIndex(
                          (i) => i.name === item.name
                        );
                        if (existingIndex >= 0) {
                          updatedItems[existingIndex] = {
                            ...updatedItems[existingIndex],
                            seeComments: e.target.checked,
                          };
                        } else {
                          updatedItems.push({
                            name: item.name,
                            approved: false,
                            seeComments: e.target.checked,
                          });
                        }
                        handleInputChange("inspectionItems", updatedItems);
                      }}
                      className="form-checkbox"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Health & Safety Plan */}
          <div className="col-span-2 mt-6">
            <div className="flex items-center gap-6">
              <span className="font-medium">Health & Safety Plan:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={inspection.healthSafetyPlan?.planRead || false}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "healthSafetyPlan",
                        "planRead",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="text-sm">Plan read and understood</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={inspection.healthSafetyPlan?.inJobFile || false}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "healthSafetyPlan",
                        "inJobFile",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="text-sm">In Job File</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={
                      inspection.healthSafetyPlan?.seenAtJobSite || false
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        "healthSafetyPlan",
                        "seenAtJobSite",
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="text-sm">Seen At Job Site</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="col-span-2 mt-6 text-sm text-gray-600">
            Required Inspection(s): A=Approved, D=Disapproved, NA=Not
            Applicable, Not checked=Not Completed
          </div>

          {/* Structural Steel - Welding */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Structural Steel - Welding, as per BC 1704.3.1
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              {/* First Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Welding Operator: To Provide
                  </label>
                  <input
                    type="text"
                    value={
                      inspection.structuralSteelWelding?.weldingOperator || ""
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "weldingOperator",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    License #: To Provide
                  </label>
                  <input
                    type="text"
                    value={
                      inspection.structuralSteelWelding?.licenseNumber || ""
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "licenseNumber",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Exp Date:
                  </label>
                  <input
                    type="date"
                    value={
                      inspection.structuralSteelWelding?.expDate?.split(
                        "T"
                      )[0] || ""
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "expDate",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Shop or Field Welded */}
              <div className="mb-6">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Shop or Field Welded:</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="shopOrField"
                        checked={
                          inspection.structuralSteelWelding?.shopOrField ===
                          "shop"
                        }
                        onChange={() =>
                          handleNestedInputChange(
                            "structuralSteelWelding",
                            "shopOrField",
                            "shop"
                          )
                        }
                        className="form-radio"
                      />
                      <span>Shop</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="shopOrField"
                        checked={
                          inspection.structuralSteelWelding?.shopOrField ===
                          "field"
                        }
                        onChange={() =>
                          handleNestedInputChange(
                            "structuralSteelWelding",
                            "shopOrField",
                            "field"
                          )
                        }
                        className="form-radio"
                      />
                      <span>Field</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <label className="block text-sm mb-2">
                    Welding Procedure Specification:
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="weldingProcedureSpec"
                        checked={
                          inspection.structuralSteelWelding
                            ?.weldingProcedureSpec?.toBeReceived || false
                        }
                        onChange={() =>
                          handleNestedInputChange(
                            "structuralSteelWelding",
                            "weldingProcedureSpec",
                            { toBeReceived: true, received: false }
                          )
                        }
                        className="form-radio"
                      />
                      <span>To be Received</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="weldingProcedureSpec"
                        checked={
                          inspection.structuralSteelWelding
                            ?.weldingProcedureSpec?.received || false
                        }
                        onChange={() =>
                          handleNestedInputChange(
                            "structuralSteelWelding",
                            "weldingProcedureSpec",
                            { toBeReceived: false, received: true }
                          )
                        }
                        className="form-radio"
                      />
                      <span>Received</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    Structural Steel Specification:
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="structuralSteelSpec"
                        checked={
                          inspection.structuralSteelWelding?.structuralSteelSpec
                            ?.toBeReceived || false
                        }
                        onChange={() =>
                          handleNestedInputChange(
                            "structuralSteelWelding",
                            "structuralSteelSpec",
                            { toBeReceived: true, received: false }
                          )
                        }
                        className="form-radio"
                      />
                      <span>To be Received</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="structuralSteelSpec"
                        checked={
                          inspection.structuralSteelWelding?.structuralSteelSpec
                            ?.received || false
                        }
                        onChange={() =>
                          handleNestedInputChange(
                            "structuralSteelWelding",
                            "structuralSteelSpec",
                            { toBeReceived: false, received: true }
                          )
                        }
                        className="form-radio"
                      />
                      <span>Received</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Machine Details */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type & Capacity of Machine:
                  </label>
                  <input
                    type="text"
                    value={inspection.structuralSteelWelding?.machineType || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "machineType",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Electrodes:
                  </label>
                  <input
                    type="text"
                    value={inspection.structuralSteelWelding?.electrodes || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "electrodes",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Polarity:
                  </label>
                  <input
                    type="text"
                    value={inspection.structuralSteelWelding?.polarity || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "polarity",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sizes:
                  </label>
                  <input
                    type="text"
                    value={inspection.structuralSteelWelding?.sizes || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "sizes",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Weld Details */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Weld Size:
                  </label>
                  <input
                    type="text"
                    value={inspection.structuralSteelWelding?.weldSize || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "weldSize",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Type of Welds:</label>
                  <input
                    type="text"
                    value={inspection.structuralSteelWelding?.typeOfWelds || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "typeOfWelds",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Layer of Beads:
                  </label>
                  <input
                    type="text"
                    value={
                      inspection.structuralSteelWelding?.layerOfBeads || ""
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "layerOfBeads",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Welding Position */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Welding Position Used:
                </label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={
                        inspection.structuralSteelWelding?.weldingPosition
                          ?.flat || false
                      }
                      onChange={(e) =>
                        handleNestedInputChange(
                          "structuralSteelWelding",
                          "weldingPosition",
                          {
                            ...inspection.structuralSteelWelding
                              ?.weldingPosition,
                            flat: e.target.checked,
                          }
                        )
                      }
                      className="form-checkbox"
                    />
                    <span>Flat</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={
                        inspection.structuralSteelWelding?.weldingPosition
                          ?.horizontal || false
                      }
                      onChange={(e) =>
                        handleNestedInputChange(
                          "structuralSteelWelding",
                          "weldingPosition",
                          {
                            ...inspection.structuralSteelWelding
                              ?.weldingPosition,
                            horizontal: e.target.checked,
                          }
                        )
                      }
                      className="form-checkbox"
                    />
                    <span>Horizontal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={
                        inspection.structuralSteelWelding?.weldingPosition
                          ?.vertical || false
                      }
                      onChange={(e) =>
                        handleNestedInputChange(
                          "structuralSteelWelding",
                          "weldingPosition",
                          {
                            ...inspection.structuralSteelWelding
                              ?.weldingPosition,
                            vertical: e.target.checked,
                          }
                        )
                      }
                      className="form-checkbox"
                    />
                    <span>Vertical</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={
                        inspection.structuralSteelWelding?.weldingPosition
                          ?.overhead || false
                      }
                      onChange={(e) =>
                        handleNestedInputChange(
                          "structuralSteelWelding",
                          "weldingPosition",
                          {
                            ...inspection.structuralSteelWelding
                              ?.weldingPosition,
                            overhead: e.target.checked,
                          }
                        )
                      }
                      className="form-checkbox"
                    />
                    <span>Overhead</span>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Lineal Inches of Welds Made:
                  </label>
                  <input
                    type="text"
                    value={
                      inspection.structuralSteelWelding?.totalLinealInches || ""
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "totalLinealInches",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Accepted:
                  </label>
                  <input
                    type="text"
                    value={inspection.structuralSteelWelding?.accepted || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "accepted",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rejected:
                  </label>
                  <input
                    type="text"
                    value={inspection.structuralSteelWelding?.rejected || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "rejected",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Joint Penetration */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Complete Joint Penetration Locations:
                  </label>
                  <input
                    type="text"
                    value={
                      inspection.structuralSteelWelding
                        ?.completeJointPenetrationLocations || ""
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "completeJointPenetrationLocations",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Partial Joint Penetration Locations:
                  </label>
                  <input
                    type="text"
                    value={
                      inspection.structuralSteelWelding
                        ?.partialJointPenetrationLocations || ""
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelWelding",
                        "partialJointPenetrationLocations",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tests */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Non-destructive tests and locations:
                </label>
                <input
                  type="text"
                  value={
                    inspection.structuralSteelWelding?.nonDestructiveTests || ""
                  }
                  onChange={(e) =>
                    handleNestedInputChange(
                      "structuralSteelWelding",
                      "nonDestructiveTests",
                      e.target.value
                    )
                  }
                  className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Comments:
                </label>
                <textarea
                  value={inspection.structuralSteelWelding?.comments || ""}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "structuralSteelWelding",
                      "comments",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Structural Steel - Details */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Structural Steel - Details, as per BC 1704.3.2
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                {/* Approved shop drawings */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Approved shop drawings for field deviations on site
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="approvedShopDrawings"
                      checked={
                        inspection.structuralSteelDetails?.approvedShopDrawings
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "approvedShopDrawings",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="approvedShopDrawings"
                      checked={
                        inspection.structuralSteelDetails?.approvedShopDrawings
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "approvedShopDrawings",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="approvedShopDrawings"
                      checked={
                        inspection.structuralSteelDetails?.approvedShopDrawings
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "approvedShopDrawings",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Bracing and stiffening */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Bracing and stiffening of structural members
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="bracingAndStiffening"
                      checked={
                        inspection.structuralSteelDetails?.bracingAndStiffening
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "bracingAndStiffening",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="bracingAndStiffening"
                      checked={
                        inspection.structuralSteelDetails?.bracingAndStiffening
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "bracingAndStiffening",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="bracingAndStiffening"
                      checked={
                        inspection.structuralSteelDetails?.bracingAndStiffening
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "bracingAndStiffening",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Location of members */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Location of members consistent with plans
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="locationOfMembers"
                      checked={
                        inspection.structuralSteelDetails?.locationOfMembers
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "locationOfMembers",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="locationOfMembers"
                      checked={
                        inspection.structuralSteelDetails?.locationOfMembers
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "locationOfMembers",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="locationOfMembers"
                      checked={
                        inspection.structuralSteelDetails?.locationOfMembers
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "locationOfMembers",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Joint details */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Joint details at each connection</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="jointDetails"
                      checked={
                        inspection.structuralSteelDetails?.jointDetails
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "jointDetails",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="jointDetails"
                      checked={
                        inspection.structuralSteelDetails?.jointDetails
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "jointDetails",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="jointDetails"
                      checked={
                        inspection.structuralSteelDetails?.jointDetails
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "jointDetails",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Seismic design */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Seismic design implemented</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="seismicDesign"
                      checked={
                        inspection.structuralSteelDetails?.seismicDesign
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "seismicDesign",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="seismicDesign"
                      checked={
                        inspection.structuralSteelDetails?.seismicDesign
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "seismicDesign",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="seismicDesign"
                      checked={
                        inspection.structuralSteelDetails?.seismicDesign
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelDetails",
                          "seismicDesign",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection.structuralSteelDetails?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelDetails",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Structural Steel - High Strength Bolting */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Structural Steel - High Strength Bolting, as per BC 1704.3.3
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                {/* Shop drawings */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Required approved shop drawings and submittals are available
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="shopDrawings"
                      checked={
                        inspection.structuralSteelBolting?.shopDrawings
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "shopDrawings",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="shopDrawings"
                      checked={
                        inspection.structuralSteelBolting?.shopDrawings
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "shopDrawings",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="shopDrawings"
                      checked={
                        inspection.structuralSteelBolting?.shopDrawings
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "shopDrawings",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Mill tests */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Assembly (bolts, nuts and washers) mill tests reports are
                    available
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="millTests"
                      checked={
                        inspection.structuralSteelBolting?.millTests
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "millTests",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="millTests"
                      checked={
                        inspection.structuralSteelBolting?.millTests
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "millTests",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="millTests"
                      checked={
                        inspection.structuralSteelBolting?.millTests
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "millTests",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Installed bolts */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Installed bolts are minimum flush with the nuts
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installedBolts"
                      checked={
                        inspection.structuralSteelBolting?.installedBolts
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "installedBolts",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installedBolts"
                      checked={
                        inspection.structuralSteelBolting?.installedBolts
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "installedBolts",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installedBolts"
                      checked={
                        inspection.structuralSteelBolting?.installedBolts
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "installedBolts",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Slip-critical connections */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Slip-critical connections have all faying surfaces clean and
                    meet mill scale requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="slipCritical"
                      checked={
                        inspection.structuralSteelBolting?.slipCritical
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "slipCritical",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="slipCritical"
                      checked={
                        inspection.structuralSteelBolting?.slipCritical
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "slipCritical",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="slipCritical"
                      checked={
                        inspection.structuralSteelBolting?.slipCritical
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "slipCritical",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Connections tightened */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Connections have been tightened in the proper sequence so as
                    not to loosen bolts previously tightened
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="connectionsTightened"
                      checked={
                        inspection.structuralSteelBolting?.connectionsTightened
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "connectionsTightened",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="connectionsTightened"
                      checked={
                        inspection.structuralSteelBolting?.connectionsTightened
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "connectionsTightened",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="connectionsTightened"
                      checked={
                        inspection.structuralSteelBolting?.connectionsTightened
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "connectionsTightened",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Bolts stored */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Bolts are properly stored, containers sealed at end of day,
                    protected from weather and elements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="boltsStored"
                      checked={
                        inspection.structuralSteelBolting?.boltsStored
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "boltsStored",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="boltsStored"
                      checked={
                        inspection.structuralSteelBolting?.boltsStored
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "boltsStored",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="boltsStored"
                      checked={
                        inspection.structuralSteelBolting?.boltsStored
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "boltsStored",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Joints snug-tight */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Joints brought to the snug-tight condition prior to the
                    pretensioning operation
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="jointsSnugTight"
                      checked={
                        inspection.structuralSteelBolting?.jointsSnugTight
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "jointsSnugTight",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="jointsSnugTight"
                      checked={
                        inspection.structuralSteelBolting?.jointsSnugTight
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "jointsSnugTight",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="jointsSnugTight"
                      checked={
                        inspection.structuralSteelBolting?.jointsSnugTight
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "structuralSteelBolting",
                          "jointsSnugTight",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection.structuralSteelBolting?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "structuralSteelBolting",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mechanical Systems */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Mechanical Systems, as per BC 1704.16
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                {/* Systems complete */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Systems are complete in accordance with mfrs guidelines and
                    approved documents
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="systemsComplete"
                      checked={
                        inspection.mechanicalSystems?.systemsComplete
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "systemsComplete",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="systemsComplete"
                      checked={
                        inspection.mechanicalSystems?.systemsComplete
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "systemsComplete",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="systemsComplete"
                      checked={
                        inspection.mechanicalSystems?.systemsComplete
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "systemsComplete",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Supports and bracing */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Supports, hangers, bracing, and vibration isolation are
                    properly spaced and anchored
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="supportsAndBracing"
                      checked={
                        inspection.mechanicalSystems?.supportsAndBracing
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "supportsAndBracing",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="supportsAndBracing"
                      checked={
                        inspection.mechanicalSystems?.supportsAndBracing
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "supportsAndBracing",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="supportsAndBracing"
                      checked={
                        inspection.mechanicalSystems?.supportsAndBracing
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "supportsAndBracing",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Required signage */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Required signage and safety instructions are present
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="requiredSignage"
                      checked={
                        inspection.mechanicalSystems?.requiredSignage
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "requiredSignage",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="requiredSignage"
                      checked={
                        inspection.mechanicalSystems?.requiredSignage
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "requiredSignage",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="requiredSignage"
                      checked={
                        inspection.mechanicalSystems?.requiredSignage
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "requiredSignage",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Electrical and Fire Alarm */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Verified Electrical and Fire Alarm work related to HVAC
                    installation have been installed and signed off
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="electricalAndFireAlarm"
                      checked={
                        inspection.mechanicalSystems?.electricalAndFireAlarm
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "electricalAndFireAlarm",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="electricalAndFireAlarm"
                      checked={
                        inspection.mechanicalSystems?.electricalAndFireAlarm
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "electricalAndFireAlarm",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="electricalAndFireAlarm"
                      checked={
                        inspection.mechanicalSystems?.electricalAndFireAlarm
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "electricalAndFireAlarm",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Ventilation balancing */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Ventilation balancing report is complete and in accordance
                    with design
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="ventilationBalancing"
                      checked={
                        inspection.mechanicalSystems?.ventilationBalancing
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "ventilationBalancing",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="ventilationBalancing"
                      checked={
                        inspection.mechanicalSystems?.ventilationBalancing
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "ventilationBalancing",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="ventilationBalancing"
                      checked={
                        inspection.mechanicalSystems?.ventilationBalancing
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "ventilationBalancing",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Required labeling */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Required labeling is present</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="requiredLabeling"
                      checked={
                        inspection.mechanicalSystems?.requiredLabeling
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "requiredLabeling",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="requiredLabeling"
                      checked={
                        inspection.mechanicalSystems?.requiredLabeling
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "requiredLabeling",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="requiredLabeling"
                      checked={
                        inspection.mechanicalSystems?.requiredLabeling
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "requiredLabeling",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Noise compliance */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Noise producing equipment within 100 feet of habitable
                    window shall be tested for compliance to code
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="noiseCompliance"
                      checked={
                        inspection.mechanicalSystems?.noiseCompliance
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "noiseCompliance",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="noiseCompliance"
                      checked={
                        inspection.mechanicalSystems?.noiseCompliance
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "noiseCompliance",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="noiseCompliance"
                      checked={
                        inspection.mechanicalSystems?.noiseCompliance
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "noiseCompliance",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Fire dampers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Required fire and fire smoke dampers have been installed and
                    are functioning properly
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireDampers"
                      checked={
                        inspection.mechanicalSystems?.fireDampers?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "fireDampers",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireDampers"
                      checked={
                        inspection.mechanicalSystems?.fireDampers
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "fireDampers",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireDampers"
                      checked={
                        inspection.mechanicalSystems?.fireDampers
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "fireDampers",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Installed unit */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Installed unit and DOB approved drawings match for Equipment
                    Use Permits (EUPs)
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installedUnit"
                      checked={
                        inspection.mechanicalSystems?.installedUnit?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "installedUnit",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installedUnit"
                      checked={
                        inspection.mechanicalSystems?.installedUnit
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "installedUnit",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installedUnit"
                      checked={
                        inspection.mechanicalSystems?.installedUnit
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "installedUnit",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Air balancing test */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Witnessed air balancing test performed using currently
                    calibrated equipment
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="airBalancingTest"
                      checked={
                        inspection.mechanicalSystems?.airBalancingTest
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "airBalancingTest",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="airBalancingTest"
                      checked={
                        inspection.mechanicalSystems?.airBalancingTest
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "airBalancingTest",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="airBalancingTest"
                      checked={
                        inspection.mechanicalSystems?.airBalancingTest
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "airBalancingTest",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* All materials used are approved */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">All materials used are approved</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="materialsApproved"
                      checked={
                        inspection.mechanicalSystems?.materialsApproved
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "materialsApproved",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="materialsApproved"
                      checked={
                        inspection.mechanicalSystems?.materialsApproved
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "materialsApproved",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="materialsApproved"
                      checked={
                        inspection.mechanicalSystems?.materialsApproved
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "mechanicalSystems",
                          "materialsApproved",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Test Equipment Section */}
                <div className="mt-6">
                  <div className="font-medium mb-4">
                    Test inspection equipment used (verified using currently
                    certified calibration):
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-8">
                      <span className="w-32">
                        Balometer used for air readings
                      </span>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems?.testEquipment
                                ?.balometer?.contractor || false
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "mechanicalSystems",
                                "testEquipment",
                                {
                                  ...inspection.mechanicalSystems
                                    ?.testEquipment,
                                  balometer: {
                                    ...inspection.mechanicalSystems
                                      ?.testEquipment?.balometer,
                                    contractor: e.target.checked,
                                  },
                                }
                              )
                            }
                            className="form-checkbox"
                          />
                          <span>Contractor&apos;s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems?.testEquipment
                                ?.balometer?.amaa || false
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "mechanicalSystems",
                                "testEquipment",
                                {
                                  ...inspection.mechanicalSystems
                                    ?.testEquipment,
                                  balometer: {
                                    ...inspection.mechanicalSystems
                                      ?.testEquipment?.balometer,
                                    amaa: e.target.checked,
                                  },
                                }
                              )
                            }
                            className="form-checkbox"
                          />
                          <span>AMAA&apos;s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems?.testEquipment
                                ?.balometer?.notApplicable || false
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "mechanicalSystems",
                                "testEquipment",
                                {
                                  ...inspection.mechanicalSystems
                                    ?.testEquipment,
                                  balometer: {
                                    ...inspection.mechanicalSystems
                                      ?.testEquipment?.balometer,
                                    notApplicable: e.target.checked,
                                  },
                                }
                              )
                            }
                            className="form-checkbox"
                          />
                          <span>Not Applicable</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <span className="w-32">
                        Octave band noise level meter
                      </span>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems?.testEquipment
                                ?.noiseMeter?.contractor || false
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "mechanicalSystems",
                                "testEquipment",
                                {
                                  ...inspection.mechanicalSystems
                                    ?.testEquipment,
                                  noiseMeter: {
                                    ...inspection.mechanicalSystems
                                      ?.testEquipment?.noiseMeter,
                                    contractor: e.target.checked,
                                  },
                                }
                              )
                            }
                            className="form-checkbox"
                          />
                          <span>Contractor&apos;s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems?.testEquipment
                                ?.noiseMeter?.notApplicable || false
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "mechanicalSystems",
                                "testEquipment",
                                {
                                  ...inspection.mechanicalSystems
                                    ?.testEquipment,
                                  noiseMeter: {
                                    ...inspection.mechanicalSystems
                                      ?.testEquipment?.noiseMeter,
                                    notApplicable: e.target.checked,
                                  },
                                }
                              )
                            }
                            className="form-checkbox"
                          />
                          <span>Not Applicable</span>
                        </div>
                      </div>
                    </div>

                    {/* Smoke test equipment */}
                    <div className="flex items-center gap-8">
                      <span className="w-32">Smoke test equipment</span>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems?.testEquipment
                                ?.smokeTest?.contractor || false
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "mechanicalSystems",
                                "testEquipment",
                                {
                                  ...inspection.mechanicalSystems
                                    ?.testEquipment,
                                  smokeTest: {
                                    ...inspection.mechanicalSystems
                                      ?.testEquipment?.smokeTest,
                                    contractor: e.target.checked,
                                  },
                                }
                              )
                            }
                            className="form-checkbox"
                          />
                          <span>Contractor&apos;s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems?.testEquipment
                                ?.smokeTest?.notApplicable || false
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "mechanicalSystems",
                                "testEquipment",
                                {
                                  ...inspection.mechanicalSystems
                                    ?.testEquipment,
                                  smokeTest: {
                                    ...inspection.mechanicalSystems
                                      ?.testEquipment?.smokeTest,
                                    notApplicable: e.target.checked,
                                  },
                                }
                              )
                            }
                            className="form-checkbox"
                          />
                          <span>Not Applicable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Serial Number */}
                <div>
                  <label className="block text-sm mb-1">
                    Serial or certification number of calibrated equipment:
                  </label>
                  <input
                    type="text"
                    value={inspection.mechanicalSystems?.serialNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "mechanicalSystems",
                        "serialNumber",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection.mechanicalSystems?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "mechanicalSystems",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sprinkler Systems */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Sprinkler Systems, as per BC 1704.23
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                {/* Installation */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Installation per NYC BC and NFPA 13
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installation"
                      checked={
                        inspection.sprinklerSystems?.installation?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "installation",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installation"
                      checked={
                        inspection.sprinklerSystems?.installation
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "installation",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installation"
                      checked={
                        inspection.sprinklerSystems?.installation
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "installation",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Correct heads */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Correct number of heads</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="correctHeads"
                      checked={
                        inspection.sprinklerSystems?.correctHeads?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "correctHeads",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="correctHeads"
                      checked={
                        inspection.sprinklerSystems?.correctHeads
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "correctHeads",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="correctHeads"
                      checked={
                        inspection.sprinklerSystems?.correctHeads
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "correctHeads",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Head spacing */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Head spacing</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="headSpacing"
                      checked={
                        inspection.sprinklerSystems?.headSpacing?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "headSpacing",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="headSpacing"
                      checked={
                        inspection.sprinklerSystems?.headSpacing?.disapproved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "headSpacing",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="headSpacing"
                      checked={
                        inspection.sprinklerSystems?.headSpacing
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "headSpacing",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Spray pattern */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Spray pattern</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="sprayPattern"
                      checked={
                        inspection.sprinklerSystems?.sprayPattern?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "sprayPattern",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="sprayPattern"
                      checked={
                        inspection.sprinklerSystems?.sprayPattern
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "sprayPattern",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="sprayPattern"
                      checked={
                        inspection.sprinklerSystems?.sprayPattern
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "sprayPattern",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Hanging and supports */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Hanging, supports and bracing</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="hangingAndSupports"
                      checked={
                        inspection.sprinklerSystems?.hangingAndSupports
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "hangingAndSupports",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="hangingAndSupports"
                      checked={
                        inspection.sprinklerSystems?.hangingAndSupports
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "hangingAndSupports",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="hangingAndSupports"
                      checked={
                        inspection.sprinklerSystems?.hangingAndSupports
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "hangingAndSupports",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Observe and record */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Observe and record all testing - Exemption (by DOB)
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="observeAndRecord"
                      checked={
                        inspection.sprinklerSystems?.observeAndRecord
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "observeAndRecord",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="observeAndRecord"
                      checked={
                        inspection.sprinklerSystems?.observeAndRecord
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "observeAndRecord",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="observeAndRecord"
                      checked={
                        inspection.sprinklerSystems?.observeAndRecord
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "observeAndRecord",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Materials approved */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Materials as per approved documents
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="materialsApproved"
                      checked={
                        inspection.sprinklerSystems?.materialsApproved
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "materialsApproved",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="materialsApproved"
                      checked={
                        inspection.sprinklerSystems?.materialsApproved
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "materialsApproved",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="materialsApproved"
                      checked={
                        inspection.sprinklerSystems?.materialsApproved
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "materialsApproved",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Maintenance instructions */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Maintenance and instructions to owner
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="maintenanceInstructions"
                      checked={
                        inspection.sprinklerSystems?.maintenanceInstructions
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "maintenanceInstructions",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="maintenanceInstructions"
                      checked={
                        inspection.sprinklerSystems?.maintenanceInstructions
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "maintenanceInstructions",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="maintenanceInstructions"
                      checked={
                        inspection.sprinklerSystems?.maintenanceInstructions
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "maintenanceInstructions",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Certification forms */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Material and test certification forms to DOB and FDNY
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="certificationForms"
                      checked={
                        inspection.sprinklerSystems?.certificationForms
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "certificationForms",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="certificationForms"
                      checked={
                        inspection.sprinklerSystems?.certificationForms
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "certificationForms",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="certificationForms"
                      checked={
                        inspection.sprinklerSystems?.certificationForms
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "sprinklerSystems",
                          "certificationForms",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Test Equipment Section */}
                <div className="mt-6">
                  <div className="font-medium mb-4">
                    Test inspection equipment used (verified using currently
                    certified calibration):
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="w-32">Pressure gauge</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            inspection.sprinklerSystems?.testEquipment
                              ?.pressureGauge?.contractor || false
                          }
                          onChange={(e) =>
                            handleNestedInputChange(
                              "sprinklerSystems",
                              "testEquipment",
                              {
                                ...inspection.sprinklerSystems?.testEquipment,
                                pressureGauge: {
                                  ...inspection.sprinklerSystems?.testEquipment
                                    ?.pressureGauge,
                                  contractor: e.target.checked,
                                },
                              }
                            )
                          }
                          className="form-checkbox"
                        />
                        <span>Contractor&apos;s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            inspection.sprinklerSystems?.testEquipment
                              ?.pressureGauge?.amaa || false
                          }
                          onChange={(e) =>
                            handleNestedInputChange(
                              "sprinklerSystems",
                              "testEquipment",
                              {
                                ...inspection.sprinklerSystems?.testEquipment,
                                pressureGauge: {
                                  ...inspection.sprinklerSystems?.testEquipment
                                    ?.pressureGauge,
                                  amaa: e.target.checked,
                                },
                              }
                            )
                          }
                          className="form-checkbox"
                        />
                        <span>AMAA&apos;s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            inspection.sprinklerSystems?.testEquipment
                              ?.pressureGauge?.notApplicable || false
                          }
                          onChange={(e) =>
                            handleNestedInputChange(
                              "sprinklerSystems",
                              "testEquipment",
                              {
                                ...inspection.sprinklerSystems?.testEquipment,
                                pressureGauge: {
                                  ...inspection.sprinklerSystems?.testEquipment
                                    ?.pressureGauge,
                                  notApplicable: e.target.checked,
                                },
                              }
                            )
                          }
                          className="form-checkbox"
                        />
                        <span>Not Applicable</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Serial Number */}
                <div>
                  <label className="block text-sm mb-1">
                    Serial or certification number of calibrated equipment:
                  </label>
                  <input
                    type="text"
                    value={inspection.sprinklerSystems?.serialNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "sprinklerSystems",
                        "serialNumber",
                        e.target.value
                      )
                    }
                    className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection.sprinklerSystems?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "sprinklerSystems",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Heating Systems */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Heating Systems, as per BC 1704.25
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Comments */}
                <div>
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection.heatingSystems?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "heatingSystems",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fire-Resistant Penetrations and Joints */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Fire-Resistant Penetrations and Joints, as per BC 1704.27
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                {/* Fire-rated walls */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Penetrations of fire-rated walls properly sealed with
                    approved materials
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedWalls"
                      checked={
                        inspection.fireResistantPenetrations?.fireRatedWalls
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "fireRatedWalls",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedWalls"
                      checked={
                        inspection.fireResistantPenetrations?.fireRatedWalls
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "fireRatedWalls",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedWalls"
                      checked={
                        inspection.fireResistantPenetrations?.fireRatedWalls
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "fireRatedWalls",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Floors */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Penetrations of floors properly sealed with approved
                    materials
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="floors"
                      checked={
                        inspection.fireResistantPenetrations?.floors
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "floors",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="floors"
                      checked={
                        inspection.fireResistantPenetrations?.floors
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "floors",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="floors"
                      checked={
                        inspection.fireResistantPenetrations?.floors
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "floors",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Construction joints */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Construction joints have properly sealed with approved
                    materials
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="constructionJoints"
                      checked={
                        inspection.fireResistantPenetrations?.constructionJoints
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "constructionJoints",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="constructionJoints"
                      checked={
                        inspection.fireResistantPenetrations?.constructionJoints
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "constructionJoints",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="constructionJoints"
                      checked={
                        inspection.fireResistantPenetrations?.constructionJoints
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "constructionJoints",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Draftstopping */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Draftstopping installed in approved manner
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="draftstopping"
                      checked={
                        inspection.fireResistantPenetrations?.draftstopping
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "draftstopping",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="draftstopping"
                      checked={
                        inspection.fireResistantPenetrations?.draftstopping
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "draftstopping",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="draftstopping"
                      checked={
                        inspection.fireResistantPenetrations?.draftstopping
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "draftstopping",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Fireblocking */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Fireblocking installed in approved manner
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireblocking"
                      checked={
                        inspection.fireResistantPenetrations?.fireblocking
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "fireblocking",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireblocking"
                      checked={
                        inspection.fireResistantPenetrations?.fireblocking
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "fireblocking",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireblocking"
                      checked={
                        inspection.fireResistantPenetrations?.fireblocking
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistantPenetrations",
                          "fireblocking",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection.fireResistantPenetrations?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "fireResistantPenetrations",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Post-Installed Anchors */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Post-Installed Anchors (BB# 2014-018, 2014-019), as per BC 1704.32
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                {/* Storage */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Storage and preparation of anchors
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="storage"
                      checked={
                        inspection.postInstalledAnchors?.storage?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "storage",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="storage"
                      checked={
                        inspection.postInstalledAnchors?.storage?.disapproved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "storage",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="storage"
                      checked={
                        inspection.postInstalledAnchors?.storage
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "storage",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Placement */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Placement, type, size and location
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="placement"
                      checked={
                        inspection.postInstalledAnchors?.placement?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "placement",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="placement"
                      checked={
                        inspection.postInstalledAnchors?.placement
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "placement",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="placement"
                      checked={
                        inspection.postInstalledAnchors?.placement
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "placement",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Labeling */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Labeling of expansion, undercut, adhesive or screw anchors
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="labeling"
                      checked={
                        inspection.postInstalledAnchors?.labeling?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "labeling",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="labeling"
                      checked={
                        inspection.postInstalledAnchors?.labeling
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "labeling",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="labeling"
                      checked={
                        inspection.postInstalledAnchors?.labeling
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "labeling",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Evaluation report */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Evaluation report per AC193 and/or AC308
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="evaluationReport"
                      checked={
                        inspection.postInstalledAnchors?.evaluationReport
                          ?.approved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "evaluationReport",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="evaluationReport"
                      checked={
                        inspection.postInstalledAnchors?.evaluationReport
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "evaluationReport",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="evaluationReport"
                      checked={
                        inspection.postInstalledAnchors?.evaluationReport
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "evaluationReport",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Pre-drilled holes */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Pre-drilled holes conform to specifications
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="predrilled"
                      checked={
                        inspection.postInstalledAnchors?.predrilled?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "predrilled",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="predrilled"
                      checked={
                        inspection.postInstalledAnchors?.predrilled
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "predrilled",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="predrilled"
                      checked={
                        inspection.postInstalledAnchors?.predrilled
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "predrilled",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Installer certification */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Installer is certified as Adhesive Anchor Installer
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installer"
                      checked={
                        inspection.postInstalledAnchors?.installer?.approved ||
                        false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "installer",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installer"
                      checked={
                        inspection.postInstalledAnchors?.installer
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "installer",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="installer"
                      checked={
                        inspection.postInstalledAnchors?.installer
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "postInstalledAnchors",
                          "installer",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection.postInstalledAnchors?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "postInstalledAnchors",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Energy Code Compliance */}
          <div className="col-span-2 mt-8 border-t pt-6">
            <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
              Energy Code Compliance, as per BC 110.3.5
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div></div>
                <div className="text-center w-16">A</div>
                <div className="text-center w-16">D</div>
                <div className="text-center w-16">NA</div>
              </div>

              {/* Foundation insulation */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">
                  Protection of exposed foundation insulation
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="foundationInsulation"
                    checked={
                      inspection?.energyCodeCompliance?.foundationInsulation
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "foundationInsulation",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="foundationInsulation"
                    checked={
                      inspection?.energyCodeCompliance?.foundationInsulation
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "foundationInsulation",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="foundationInsulation"
                    checked={
                      inspection?.energyCodeCompliance?.foundationInsulation
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "foundationInsulation",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Insulation placement */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Insulation placement and R-values</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="insulationPlacement"
                    checked={
                      inspection?.energyCodeCompliance?.insulationPlacement
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "insulationPlacement",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="insulationPlacement"
                    checked={
                      inspection?.energyCodeCompliance?.insulationPlacement
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "insulationPlacement",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="insulationPlacement"
                    checked={
                      inspection?.energyCodeCompliance?.insulationPlacement
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "insulationPlacement",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Fenestration ratings */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">
                  Fenestration and door U-factor and product ratings
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fenestrationRatings"
                    checked={
                      inspection?.energyCodeCompliance?.fenestrationRatings
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fenestrationRatings",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fenestrationRatings"
                    checked={
                      inspection?.energyCodeCompliance?.fenestrationRatings
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fenestrationRatings",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fenestrationRatings"
                    checked={
                      inspection?.energyCodeCompliance?.fenestrationRatings
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fenestrationRatings",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Air leakage */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Fenestration air leakage</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airLeakage"
                    checked={
                      inspection?.energyCodeCompliance?.airLeakage?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airLeakage",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airLeakage"
                    checked={
                      inspection?.energyCodeCompliance?.airLeakage?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airLeakage",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airLeakage"
                    checked={
                      inspection?.energyCodeCompliance?.airLeakage
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airLeakage",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Fenestration areas */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Fenestration areas</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fenestrationAreas"
                    checked={
                      inspection?.energyCodeCompliance?.fenestrationAreas
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fenestrationAreas",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fenestrationAreas"
                    checked={
                      inspection?.energyCodeCompliance?.fenestrationAreas
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fenestrationAreas",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fenestrationAreas"
                    checked={
                      inspection?.energyCodeCompliance?.fenestrationAreas
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fenestrationAreas",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Air barrier visual */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Air barrier – visual inspection</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierVisual"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierVisual
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierVisual",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierVisual"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierVisual
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierVisual",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierVisual"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierVisual
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierVisual",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Air barrier testing */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Air barrier – testing</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierTesting"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierTesting
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierTesting",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierTesting"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierTesting
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierTesting",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierTesting"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierTesting
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierTesting",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Air barrier continuity */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">
                  Air barrier continuity plan testing/inspection
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierContinuity"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierContinuity
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierContinuity",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierContinuity"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierContinuity
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierContinuity",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="airBarrierContinuity"
                    checked={
                      inspection?.energyCodeCompliance?.airBarrierContinuity
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "airBarrierContinuity",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Vestibules */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Vestibules</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="vestibules"
                    checked={
                      inspection?.energyCodeCompliance?.vestibules?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "vestibules",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="vestibules"
                    checked={
                      inspection?.energyCodeCompliance?.vestibules?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "vestibules",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="vestibules"
                    checked={
                      inspection?.energyCodeCompliance?.vestibules
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "vestibules",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Fireplaces */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Fireplaces</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fireplaces"
                    checked={
                      inspection?.energyCodeCompliance?.fireplaces?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fireplaces",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fireplaces"
                    checked={
                      inspection?.energyCodeCompliance?.fireplaces?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fireplaces",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="fireplaces"
                    checked={
                      inspection?.energyCodeCompliance?.fireplaces
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "fireplaces",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Ventilation system */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">
                  Ventilation and air distribution system
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="ventilationSystem"
                    checked={
                      inspection?.energyCodeCompliance?.ventilationSystem
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "ventilationSystem",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="ventilationSystem"
                    checked={
                      inspection?.energyCodeCompliance?.ventilationSystem
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "ventilationSystem",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="ventilationSystem"
                    checked={
                      inspection?.energyCodeCompliance?.ventilationSystem
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "ventilationSystem",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Shutoff dampers */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Shutoff dampers</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="shutoffDampers"
                    checked={
                      inspection?.energyCodeCompliance?.shutoffDampers?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "shutoffDampers",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="shutoffDampers"
                    checked={
                      inspection?.energyCodeCompliance?.shutoffDampers
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "shutoffDampers",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="shutoffDampers"
                    checked={
                      inspection?.energyCodeCompliance?.shutoffDampers
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "shutoffDampers",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* HVAC-R and service water heating equipment */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">
                  HVAC-R and service water heating equipment
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacEquipment"
                    checked={
                      inspection?.energyCodeCompliance?.hvacEquipment?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacEquipment",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacEquipment"
                    checked={
                      inspection?.energyCodeCompliance?.hvacEquipment
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacEquipment",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacEquipment"
                    checked={
                      inspection?.energyCodeCompliance?.hvacEquipment
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacEquipment",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* HVAC-R and service water heating system controls */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">
                  HVAC-R and service water heating system controls
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacControls"
                    checked={
                      inspection?.energyCodeCompliance?.hvacControls?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacControls",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacControls"
                    checked={
                      inspection?.energyCodeCompliance?.hvacControls
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacControls",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacControls"
                    checked={
                      inspection?.energyCodeCompliance?.hvacControls
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacControls",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* HVAC-R and service water piping design and insulation */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">
                  HVAC-R and service water piping design and insulation
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacPiping"
                    checked={
                      inspection?.energyCodeCompliance?.hvacPiping?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacPiping",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacPiping"
                    checked={
                      inspection?.energyCodeCompliance?.hvacPiping?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacPiping",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="hvacPiping"
                    checked={
                      inspection?.energyCodeCompliance?.hvacPiping
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "hvacPiping",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Duct leakage testing, insulation and design */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">
                  Duct leakage testing, insulation and design
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="ductLeakage"
                    checked={
                      inspection?.energyCodeCompliance?.ductLeakage?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "ductLeakage",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="ductLeakage"
                    checked={
                      inspection?.energyCodeCompliance?.ductLeakage?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "ductLeakage",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="ductLeakage"
                    checked={
                      inspection?.energyCodeCompliance?.ductLeakage
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "ductLeakage",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Metering */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Metering</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="metering"
                    checked={
                      inspection?.energyCodeCompliance?.metering?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "metering",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="metering"
                    checked={
                      inspection?.energyCodeCompliance?.metering?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "metering",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="metering"
                    checked={
                      inspection?.energyCodeCompliance?.metering?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "metering",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Lighting in dwelling units */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Lighting in dwelling units</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="dwellingLighting"
                    checked={
                      inspection?.energyCodeCompliance?.dwellingLighting
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "dwellingLighting",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="dwellingLighting"
                    checked={
                      inspection?.energyCodeCompliance?.dwellingLighting
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "dwellingLighting",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="dwellingLighting"
                    checked={
                      inspection?.energyCodeCompliance?.dwellingLighting
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "dwellingLighting",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Interior lighting power */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Interior lighting power</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="interiorLighting"
                    checked={
                      inspection?.energyCodeCompliance?.interiorLighting
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "interiorLighting",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="interiorLighting"
                    checked={
                      inspection?.energyCodeCompliance?.interiorLighting
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "interiorLighting",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="interiorLighting"
                    checked={
                      inspection?.energyCodeCompliance?.interiorLighting
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "interiorLighting",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Exterior lighting power */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Exterior lighting power</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="exteriorLighting"
                    checked={
                      inspection?.energyCodeCompliance?.exteriorLighting
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "exteriorLighting",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="exteriorLighting"
                    checked={
                      inspection?.energyCodeCompliance?.exteriorLighting
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "exteriorLighting",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="exteriorLighting"
                    checked={
                      inspection?.energyCodeCompliance?.exteriorLighting
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "exteriorLighting",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Lighting controls */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Lighting controls</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="lightingControls"
                    checked={
                      inspection?.energyCodeCompliance?.lightingControls
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "lightingControls",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="lightingControls"
                    checked={
                      inspection?.energyCodeCompliance?.lightingControls
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "lightingControls",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="lightingControls"
                    checked={
                      inspection?.energyCodeCompliance?.lightingControls
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "lightingControls",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Electrical motors and elevators */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Electrical motors and elevators</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="electricalMotors"
                    checked={
                      inspection?.energyCodeCompliance?.electricalMotors
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "electricalMotors",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="electricalMotors"
                    checked={
                      inspection?.energyCodeCompliance?.electricalMotors
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "electricalMotors",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="electricalMotors"
                    checked={
                      inspection?.energyCodeCompliance?.electricalMotors
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "electricalMotors",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Maintenance information */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Maintenance information</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="maintenanceInfo"
                    checked={
                      inspection?.energyCodeCompliance?.maintenanceInfo
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "maintenanceInfo",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="maintenanceInfo"
                    checked={
                      inspection?.energyCodeCompliance?.maintenanceInfo
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "maintenanceInfo",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="maintenanceInfo"
                    checked={
                      inspection?.energyCodeCompliance?.maintenanceInfo
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "maintenanceInfo",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Permanent certificate */}
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                <div className="italic">Permanent certificate</div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="permanentCertificate"
                    checked={
                      inspection?.energyCodeCompliance?.permanentCertificate
                        ?.approved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "permanentCertificate",
                        "approved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="permanentCertificate"
                    checked={
                      inspection?.energyCodeCompliance?.permanentCertificate
                        ?.disapproved
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "permanentCertificate",
                        "disapproved",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
                <div className="text-center w-16">
                  <input
                    type="radio"
                    name="permanentCertificate"
                    checked={
                      inspection?.energyCodeCompliance?.permanentCertificate
                        ?.notApplicable
                    }
                    onChange={(e) =>
                      handleEnergyCodeComplianceChange(
                        "permanentCertificate",
                        "notApplicable",
                        e.target.checked
                      )
                    }
                    className="form-radio"
                  />
                </div>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <label className="block text-sm mb-1">Comments:</label>
                <textarea
                  value={inspection?.energyCodeCompliance?.comments || ""}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "energyCodeCompliance",
                      "comments",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Fire-Resistance Rated Construction */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Fire-Resistance Rated Construction, as per BC 110.3.4
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                {/* Fire-rated partitions */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire-rated partitions comply with design and code
                    requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedPartitions"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedPartitions
                          ?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedPartitions",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedPartitions"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedPartitions
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedPartitions",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedPartitions"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedPartitions
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedPartitions",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Fire-rated floors */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire-rated floors comply with design and code
                    requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedFloors"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedFloors
                          ?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedFloors",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedFloors"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedFloors
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedFloors",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedFloors"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedFloors
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedFloors",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Fire-rated ceilings */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire-rated ceilings comply with design and code
                    requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedCeilings"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedCeilings
                          ?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedCeilings",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedCeilings"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedCeilings
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedCeilings",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedCeilings"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedCeilings
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedCeilings",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Fire-rated shafts */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire-rated shafts comply with design and code
                    requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedShafts"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedShafts
                          ?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedShafts",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedShafts"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedShafts
                          ?.disapproved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedShafts",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireRatedShafts"
                      checked={
                        inspection?.fireResistanceRated?.fireRatedShafts
                          ?.notApplicable
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireRatedShafts",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Fire shutters */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire shutters comply with design and code requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireShutters"
                      checked={
                        inspection?.fireResistanceRated?.fireShutters?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireShutters",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireShutters"
                      checked={
                        inspection?.fireResistanceRated?.fireShutters
                          ?.disapproved || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireShutters",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="fireShutters"
                      checked={
                        inspection?.fireResistanceRated?.fireShutters
                          ?.notApplicable || false
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "fireResistanceRated",
                          "fireShutters",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection?.fireResistanceRated?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "fireResistanceRated",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Final Inspection */}
          <div className="col-span-2 mt-8">
            <div className="bg-[#4A90E2] text-white py-2 px-4 rounded-t-lg text-center text-xl font-medium">
              Final Inspection, as per BC 28-116.2.4.2 and Directive 14 of 1975
            </div>
            <div className="border border-t-0 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Headers */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                {/* Construction complete */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Construction work is complete and in substantial compliance
                    with approved construction documents
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="constructionComplete"
                      checked={
                        inspection?.finalInspection?.constructionComplete
                          ?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "constructionComplete",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="constructionComplete"
                      checked={
                        inspection?.finalInspection?.constructionComplete
                          ?.disapproved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "constructionComplete",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="constructionComplete"
                      checked={
                        inspection?.finalInspection?.constructionComplete
                          ?.notApplicable
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "constructionComplete",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Code compliance */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All work has been built to code and complies with all local
                    laws
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="codeCompliance"
                      checked={
                        inspection?.finalInspection?.codeCompliance?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "codeCompliance",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="codeCompliance"
                      checked={
                        inspection?.finalInspection?.codeCompliance?.disapproved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "codeCompliance",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="codeCompliance"
                      checked={
                        inspection?.finalInspection?.codeCompliance
                          ?.notApplicable
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "codeCompliance",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Inspection items */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All required special and progress inspection items have been
                    approved
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="inspectionItems"
                      checked={
                        inspection?.finalInspection?.inspectionItems?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "inspectionItems",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="inspectionItems"
                      checked={
                        inspection?.finalInspection?.inspectionItems
                          ?.disapproved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "inspectionItems",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="inspectionItems"
                      checked={
                        inspection?.finalInspection?.inspectionItems
                          ?.notApplicable
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "inspectionItems",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Egress paths */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Paths of egress are provided in accordance with design and
                    code requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="egressPaths"
                      checked={
                        inspection?.finalInspection?.egressPaths?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "egressPaths",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="egressPaths"
                      checked={
                        inspection?.finalInspection?.egressPaths?.disapproved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "egressPaths",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="egressPaths"
                      checked={
                        inspection?.finalInspection?.egressPaths?.notApplicable
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "egressPaths",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Exit signs */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Exit signs are in the proper location and indicate the
                    correct means of egress
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="exitSigns"
                      checked={inspection?.finalInspection?.exitSigns?.approved}
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "exitSigns",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="exitSigns"
                      checked={
                        inspection?.finalInspection?.exitSigns?.disapproved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "exitSigns",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="exitSigns"
                      checked={
                        inspection?.finalInspection?.exitSigns?.notApplicable
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "exitSigns",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* ADA compliance */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Construction complies with ADA requirements indicated on
                    drawings
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="adaCompliance"
                      checked={
                        inspection?.finalInspection?.adaCompliance?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "adaCompliance",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="adaCompliance"
                      checked={
                        inspection?.finalInspection?.adaCompliance?.disapproved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "adaCompliance",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="adaCompliance"
                      checked={
                        inspection?.finalInspection?.adaCompliance
                          ?.notApplicable
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "adaCompliance",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Doors direction */}
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Doors open in the correct direction and have fire-ratings
                    indicated on drawings
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="doorsDirection"
                      checked={
                        inspection?.finalInspection?.doorsDirection?.approved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "doorsDirection",
                          {
                            approved: true,
                            disapproved: false,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="doorsDirection"
                      checked={
                        inspection?.finalInspection?.doorsDirection?.disapproved
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "doorsDirection",
                          {
                            approved: false,
                            disapproved: true,
                            notApplicable: false,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      name="doorsDirection"
                      checked={
                        inspection?.finalInspection?.doorsDirection
                          ?.notApplicable
                      }
                      onChange={() =>
                        handleNestedInputChange(
                          "finalInspection",
                          "doorsDirection",
                          {
                            approved: false,
                            disapproved: false,
                            notApplicable: true,
                          }
                        )
                      }
                      className="form-radio"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-6">
                  <label className="block text-sm mb-1">Comments:</label>
                  <textarea
                    value={inspection?.finalInspection?.comments || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "finalInspection",
                        "comments",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Final Inspection section */}
          <div className="col-span-2 mt-8 border-t pt-6">
            <div className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
              Comments and additional information, including photographs
            </div>
            {inspection.images?.length > 0 ? (
              <div className="space-y-8">
                {inspection.images.map((imageGroup, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {imageGroup.urls.map((url, urlIndex) => (
                        <div key={urlIndex} className="relative">
                          <button
                            onClick={() => {
                              const updatedImages = [...inspection.images];
                              const updatedUrls = [...imageGroup.urls];
                              updatedUrls.splice(urlIndex, 1);
                              updatedImages[index] = {
                                ...imageGroup,
                                urls: updatedUrls,
                              };
                              // Remove the entire group if no images left
                              if (updatedUrls.length === 0) {
                                updatedImages.splice(index, 1);
                              }
                              // Only update the local state, don't trigger a server update
                              setInspection((prev) => ({
                                ...prev,
                                images: updatedImages,
                              }));
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <Image
                            src={url}
                            alt={`Inspection image ${index + 1}-${
                              urlIndex + 1
                            }`}
                            width={400}
                            height={300}
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Comments:</label>
                      <textarea
                        value={imageGroup.comment || ""}
                        onChange={(e) => {
                          const updatedImages = [...inspection.images];
                          updatedImages[index] = {
                            ...imageGroup,
                            comment: e.target.value,
                          };
                          // Only update the local state, don't trigger a server update
                          setInspection((prev) => ({
                            ...prev,
                            images: updatedImages,
                          }));
                        }}
                        rows={3}
                        className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">
                No images available
              </p>
            )}

            {/* Add Image button - centered */}
            <div className="flex justify-center mt-6 mb-4">
              <button
                type="button"
                onClick={() => setShowImageOptions(!showImageOptions)}
                className="bg-[#4A90E2] text-white px-4 py-2 rounded hover:bg-[#357ABD] transition-colors"
              >
                Add Image
              </button>
            </div>

            {showImageOptions && (
              <div className="mt-4 space-y-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleImageCapture}
                  className="block w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                >
                  Take Image
                </button>
                <label className="block w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="block w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-center cursor-pointer">
                    Choose Image
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-[#4A90E2] text-white px-6 py-2 rounded hover:bg-[#357ABD] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
