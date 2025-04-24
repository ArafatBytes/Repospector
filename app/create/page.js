"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function CreateInspection() {
  const router = useRouter();
  const [ssWelding, setSsWelding] = useState(false);
  const [ssDetails, setSsDetails] = useState(false);
  const [ssBolting, setSsBolting] = useState(false);
  const [ms, setMs] = useState(false);
  const [sprinkler, setSprinkler] = useState(false);
  const [heating, setHeating] = useState(false);
  const [fireResistance, setFireResistance] = useState(false);
  const [anchors, setAnchors] = useState(false);
  const [energyCode, setEnergyCode] = useState(false);
  const [fireResistanceRated, setFireResistanceRated] = useState(false);
  const [finalInspection, setFinalInspection] = useState(false);
  const [images, setImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [formData, setFormData] = useState({
    reportType: "",
    inspectorEmail: "",
    client: "",
    amaaProjectNumber: "",
    sentTo: "",
    projectName: "",
    cityCounty: "",
    address: "",
    floor: "",
    date: "",
    timeArrived: "",
    timeDeparted: "",
    personsMet: "",
    dobApplication: "",
    inspectionItems: [
      {
        name: "Structural Steel – Welding, as per BC 1705.2.1",
        approved: false,
        seeComments: false,
      },
      {
        name: "Structural Steel – Details, as per BC 1705.2.2",
        approved: false,
        seeComments: false,
      },
      {
        name: "Structural Steel – High Strength Bolting, as per BC 1705.2.3",
        approved: false,
        seeComments: false,
      },
      {
        name: "Mechanical Systems, as per BC 1705.21",
        approved: false,
        seeComments: false,
      },
      {
        name: "Sprinkler Systems, as per BC 1705.29",
        approved: false,
        seeComments: false,
      },
      {
        name: "Heating Systems, as per BC 1705.31",
        approved: false,
        seeComments: false,
      },
      {
        name: "Fire-Resistant Penetrations and Joints, as per BC 1705.17",
        approved: false,
        seeComments: false,
      },
      {
        name: "Post-Installed Anchors (BB# 2014-018, 2014-019), as per BC 1705.37",
        approved: false,
        seeComments: false,
      },
      {
        name: "Energy Code Compliance, as per BC 110.3.5",
        approved: false,
        seeComments: false,
      },
      {
        name: "Fire-Resistance Rated Construction, as per BC 110.3.4",
        approved: false,
        seeComments: false,
      },
      {
        name: "Final Inspection, as per BC 28-116.2.4.2 and Directive 14 of 1975",
        approved: false,
        seeComments: false,
      },
    ],
    healthSafetyPlan: {
      planRead: false,
      inJobFile: false,
      seenAtJobSite: false,
    },
    structuralSteelWelding: {
      weldingOperator: "",
      licenseNumber: "",
      expDate: "",
      shopOrField: "",
      weldingProcedureSpec: {
        toBeReceived: false,
        received: false,
      },
      structuralSteelSpec: {
        toBeReceived: false,
        received: false,
      },
      machineType: "",
      electrodes: "",
      polarity: "",
      sizes: "",
      weldSize: "",
      typeOfWelds: "",
      layerOfBeads: "",
      weldingPosition: {
        flat: false,
        horizontal: false,
        vertical: false,
        overhead: false,
      },
      totalLinealInches: "",
      accepted: "",
      rejected: "",
      completeJointPenetrationLocations: "",
      partialJointPenetrationLocations: "",
      nonDestructiveTests: "",
      comments: "",
    },
    structuralSteelDetails: {
      approvedShopDrawings: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      bracingAndStiffening: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      locationOfMembers: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      jointDetails: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      seismicDesign: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      comments: "",
    },
    structuralSteelBolting: {
      shopDrawings: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      millTests: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      installedBolts: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      slipCritical: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      connectionsTightened: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      boltsStored: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      jointsSnugTight: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      comments: "",
    },
    mechanicalSystems: {
      systemsComplete: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      supportsAndBracing: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      requiredSignage: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      electricalAndFireAlarm: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      ventilationBalancing: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      requiredLabeling: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      noiseCompliance: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fireDampers: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      installedUnit: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      airBalancingTest: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      materialsApproved: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      testEquipment: {
        balometer: {
          contractor: false,
          amaa: false,
          notApplicable: false,
        },
        noiseMeter: {
          contractor: false,
          notApplicable: false,
        },
        smokeTest: {
          contractor: false,
          notApplicable: false,
        },
      },
      serialNumber: "",
      comments: "",
    },
    sprinklerSystems: {
      installation: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      correctHeads: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      headSpacing: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      sprayPattern: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      hangingAndSupports: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      observeAndRecord: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      materialsApproved: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      maintenanceInstructions: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      certificationForms: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      testEquipment: {
        pressureGauge: {
          contractor: false,
          amaa: false,
          notApplicable: false,
        },
      },
      serialNumber: "",
      comments: "",
    },
    heatingSystems: {
      comments: "",
    },
    fireResistantPenetrations: {
      fireRatedWalls: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      floors: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      constructionJoints: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      draftstopping: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fireblocking: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      comments: "",
    },
    postInstalledAnchors: {
      storage: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      placement: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      labeling: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      evaluationReport: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      predrilled: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      installer: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      comments: "",
    },
    energyCodeCompliance: {
      foundationInsulation: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      insulationPlacement: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fenestrationRatings: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      airLeakage: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fenestrationAreas: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      airBarrierVisual: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      airBarrierTesting: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      airBarrierContinuity: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      vestibules: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fireplaces: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      ventilationSystem: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      shutoffDampers: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      hvacEquipment: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      hvacControls: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      hvacPiping: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      ductLeakage: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      metering: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      dwellingLighting: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      interiorLighting: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      exteriorLighting: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      lightingControls: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      electricalMotors: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      maintenanceInfo: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      permanentCertificate: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      comments: "",
    },
    fireResistanceRated: {
      fireRatedPartitions: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fireRatedFloors: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fireRatedCeilings: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fireRatedShafts: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      fireShutters: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      comments: "",
    },
    finalInspection: {
      constructionComplete: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      codeCompliance: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      inspectionItems: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      egressPaths: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      exitSigns: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      adaCompliance: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      doorsDirection: {
        approved: false,
        disapproved: false,
        notApplicable: false,
      },
      comments: "",
    },
    images: [],
    nonConformanceReason: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInspectionItemChange = (index, field) => {
    const newInspectionItems = [...formData.inspectionItems];
    newInspectionItems[index] = {
      ...newInspectionItems[index],
      [field]: !newInspectionItems[index][field],
    };
    setFormData((prev) => ({
      ...prev,
      inspectionItems: newInspectionItems,
    }));
  };

  const handleHealthSafetyChange = (field) => {
    setFormData((prev) => ({
      ...prev,
      healthSafetyPlan: {
        ...prev.healthSafetyPlan,
        [field]: !prev.healthSafetyPlan[field],
      },
    }));
  };

  const handleWeldingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      structuralSteelWelding: {
        ...prev.structuralSteelWelding,
        [field]: value,
      },
    }));
  };

  const handleWeldingPositionChange = (position) => {
    setFormData((prev) => ({
      ...prev,
      structuralSteelWelding: {
        ...prev.structuralSteelWelding,
        weldingPosition: {
          ...prev.structuralSteelWelding.weldingPosition,
          [position]: !prev.structuralSteelWelding.weldingPosition[position],
        },
      },
    }));
  };

  const handleSpecificationChange = (field, type) => {
    setFormData((prev) => ({
      ...prev,
      structuralSteelWelding: {
        ...prev.structuralSteelWelding,
        [field]: {
          ...prev.structuralSteelWelding[field],
          toBeReceived: type === "toBeReceived",
          received: type === "received",
        },
      },
    }));
  };

  const handleSteelDetailsChange = (field, value) => {
    if (field === "comments") {
      setFormData((prev) => ({
        ...prev,
        structuralSteelDetails: {
          ...prev.structuralSteelDetails,
          comments: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        structuralSteelDetails: {
          ...prev.structuralSteelDetails,
          [field]: {
            ...prev.structuralSteelDetails[field],
            approved: value === "A",
            disapproved: value === "D",
            notApplicable: value === "NA",
          },
        },
      }));
    }
  };

  const handleSteelBoltingChange = (field, value) => {
    if (field === "comments") {
      setFormData((prev) => ({
        ...prev,
        structuralSteelBolting: {
          ...prev.structuralSteelBolting,
          comments: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        structuralSteelBolting: {
          ...prev.structuralSteelBolting,
          [field]: {
            ...prev.structuralSteelBolting[field],
            approved: value === "A",
            disapproved: value === "D",
            notApplicable: value === "NA",
          },
        },
      }));
    }
  };

  const handleMechanicalChange = (field, status) => {
    setFormData((prev) => ({
      ...prev,
      mechanicalSystems: {
        ...prev.mechanicalSystems,
        [field]: {
          ...prev.mechanicalSystems[field],
          approved: status === "A",
          disapproved: status === "D",
          notApplicable: status === "NA",
        },
      },
    }));
  };

  const handleMechanicalTestEquipment = (equipment, type) => {
    setFormData((prev) => ({
      ...prev,
      mechanicalSystems: {
        ...prev.mechanicalSystems,
        testEquipment: {
          ...prev.mechanicalSystems.testEquipment,
          [equipment]: {
            ...prev.mechanicalSystems.testEquipment[equipment],
            contractor: type === "contractor",
            amaa: type === "amaa",
            notApplicable: type === "notApplicable",
          },
        },
      },
    }));
  };

  const handleMechanicalSerialNumber = (value) => {
    setFormData((prev) => ({
      ...prev,
      mechanicalSystems: {
        ...prev.mechanicalSystems,
        serialNumber: value,
      },
    }));
  };

  const handleMechanicalCommentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      mechanicalSystems: {
        ...prev.mechanicalSystems,
        comments: value,
      },
    }));
  };

  const handleSprinklerChange = (field, status) => {
    setFormData((prev) => ({
      ...prev,
      sprinklerSystems: {
        ...prev.sprinklerSystems,
        [field]: {
          ...prev.sprinklerSystems[field],
          approved: status === "A",
          disapproved: status === "D",
          notApplicable: status === "NA",
        },
      },
    }));
  };

  const handleSprinklerTestEquipment = (type) => {
    setFormData((prev) => ({
      ...prev,
      sprinklerSystems: {
        ...prev.sprinklerSystems,
        testEquipment: {
          ...prev.sprinklerSystems.testEquipment,
          pressureGauge: {
            contractor: type === "contractor",
            amaa: type === "amaa",
            notApplicable: type === "notApplicable",
          },
        },
      },
    }));
  };

  const handleSprinklerSerialNumber = (value) => {
    setFormData((prev) => ({
      ...prev,
      sprinklerSystems: {
        ...prev.sprinklerSystems,
        serialNumber: value,
      },
    }));
  };

  const handleSprinklerCommentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      sprinklerSystems: {
        ...prev.sprinklerSystems,
        comments: value,
      },
    }));
  };

  const handleHeatingCommentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      heatingSystems: {
        ...prev.heatingSystems,
        comments: value,
      },
    }));
  };

  const handlePenetrationsChange = (field, status) => {
    setFormData((prev) => ({
      ...prev,
      fireResistantPenetrations: {
        ...prev.fireResistantPenetrations,
        [field]: {
          ...prev.fireResistantPenetrations[field],
          approved: status === "A",
          disapproved: status === "D",
          notApplicable: status === "NA",
        },
      },
    }));
  };

  const handlePenetrationsCommentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      fireResistantPenetrations: {
        ...prev.fireResistantPenetrations,
        comments: value,
      },
    }));
  };

  const handleAnchorsChange = (field, status) => {
    setFormData((prev) => ({
      ...prev,
      postInstalledAnchors: {
        ...prev.postInstalledAnchors,
        [field]: {
          ...prev.postInstalledAnchors[field],
          approved: status === "A",
          disapproved: status === "D",
          notApplicable: status === "NA",
        },
      },
    }));
  };

  const handleAnchorsCommentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      postInstalledAnchors: {
        ...prev.postInstalledAnchors,
        comments: value,
      },
    }));
  };

  const handleEnergyCodeChange = (field, status) => {
    setFormData((prev) => ({
      ...prev,
      energyCodeCompliance: {
        ...prev.energyCodeCompliance,
        [field]: {
          ...prev.energyCodeCompliance[field],
          approved: status === "A",
          disapproved: status === "D",
          notApplicable: status === "NA",
        },
      },
    }));
  };

  const handleEnergyCodeCommentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      energyCodeCompliance: {
        ...prev.energyCodeCompliance,
        comments: value,
      },
    }));
  };

  const handleFireResistanceChange = (field, status) => {
    setFormData((prev) => ({
      ...prev,
      fireResistanceRated: {
        ...prev.fireResistanceRated,
        [field]: {
          ...prev.fireResistanceRated[field],
          approved: status === "A",
          disapproved: status === "D",
          notApplicable: status === "NA",
        },
      },
    }));
  };

  const handleFireResistanceCommentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      fireResistanceRated: {
        ...prev.fireResistanceRated,
        comments: value,
      },
    }));
  };

  const handleFinalInspectionChange = (field, status) => {
    setFormData((prev) => ({
      ...prev,
      finalInspection: {
        ...prev.finalInspection,
        [field]: {
          ...prev.finalInspection[field],
          approved: status === "A",
          disapproved: status === "D",
          notApplicable: status === "NA",
        },
      },
    }));
  };

  const handleFinalInspectionCommentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      finalInspection: {
        ...prev.finalInspection,
        comments: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inspections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Inspection report submitted successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Error submitting inspection report");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting inspection report");
    } finally {
      setIsSubmitting(false);
    }
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

        // Add the image to form data
        setFormData((prev) => {
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
      setFormData((prev) => {
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-5xl mx-auto px-4">
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
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
          {/* Header */}
          <div className="bg-[#4A90E2] text-white text-center py-3 text-2xl font-semibold">
            Special Inspection Report
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Report Type Selection */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="font-bold">REPORT:</span>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="reportType"
                    value="INCOMPLETE_WORK"
                    checked={formData.reportType === "INCOMPLETE_WORK"}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  Incomplete work
                </label>
                <label className="flex items-center ml-4">
                  <input
                    type="radio"
                    name="reportType"
                    value="COMPLETE"
                    checked={formData.reportType === "COMPLETE"}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  Complete
                </label>
                <label className="flex items-center ml-4">
                  <input
                    type="radio"
                    name="reportType"
                    value="CONFORMANCE"
                    checked={formData.reportType === "CONFORMANCE"}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  Conformance
                </label>
                <label className="flex items-center ml-4">
                  <input
                    type="radio"
                    name="reportType"
                    value="NON_CONFORMANCE"
                    checked={formData.reportType === "NON_CONFORMANCE"}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  Non-conformance
                </label>
              </div>

              {formData.reportType === "NON_CONFORMANCE" && (
                <div className="mt-3 ml-6">
                  <label className="block text-sm font-medium mb-1">
                    Reason for Non-conformance:
                  </label>
                  <textarea
                    name="nonConformanceReason"
                    value={formData.nonConformanceReason || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                    rows="3"
                    required
                  />
                </div>
              )}
            </div>

            {/* Inspector Email */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="font-bold">Special Inspector Email:</span>
                <input
                  type="email"
                  name="inspectorEmail"
                  value={formData.inspectorEmail}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold mb-1">Client:</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  SSE Project #:
                </label>
                <input
                  type="text"
                  name="amaaProjectNumber"
                  value={formData.amaaProjectNumber}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  City/County Of:
                </label>
                <input
                  type="text"
                  name="cityCounty"
                  value={formData.cityCounty}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Sent To:</label>
                <input
                  type="text"
                  name="sentTo"
                  value={formData.sentTo}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Project Name:
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Time Arrived:
                  </label>
                  <input
                    type="time"
                    name="timeArrived"
                    value={formData.timeArrived}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Time Departed:
                  </label>
                  <input
                    type="time"
                    name="timeDeparted"
                    value={formData.timeDeparted}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Floor:</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Person(s) Met With:
                </label>
                <input
                  type="text"
                  name="personsMet"
                  value={formData.personsMet}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  DOB Application #:
                </label>
                <input
                  type="text"
                  name="dobApplication"
                  value={formData.dobApplication}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                />
              </div>
            </div>

            {/* Inspection Items Section */}
            <div className="mb-6">
              <p className="text-sm mb-4">
                In accordance with applicable sections of the New York City
                Building Code (BC) of 2014, special inspections have been
                provided for the following items:
              </p>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 border-b">
                      Inspection Item
                    </th>
                    <th className="w-24 text-center py-2 px-4 border-b">
                      Approved
                    </th>
                    <th className="w-24 text-center py-2 px-4 border-b">
                      See Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.inspectionItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={item.approved}
                          onChange={() =>
                            handleInspectionItemChange(index, "approved")
                          }
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={item.seeComments}
                          onChange={() =>
                            handleInspectionItemChange(index, "seeComments")
                          }
                          className="h-4 w-4"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Health & Safety Plan */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="font-bold mr-4">Health & Safety Plan:</span>
                <label className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={formData.healthSafetyPlan.planRead}
                    onChange={() => handleHealthSafetyChange("planRead")}
                    className="mr-2 h-4 w-4"
                  />
                  Plan read and understood
                </label>
                <label className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={formData.healthSafetyPlan.inJobFile}
                    onChange={() => handleHealthSafetyChange("inJobFile")}
                    className="mr-2 h-4 w-4"
                  />
                  In Job File
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.healthSafetyPlan.seenAtJobSite}
                    onChange={() => handleHealthSafetyChange("seenAtJobSite")}
                    className="mr-2 h-4 w-4"
                  />
                  Seen At Job Site
                </label>
              </div>
            </div>

            {/* Required Inspection Legend */}
            <div className="text-sm text-gray-600 mb-8">
              Required Inspection(s): A=Approved, D=Disapproved, NA=Not
              Applicable, Not checked=Not Completed
            </div>

            {/* Structural Steel - Welding Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setSsWelding(!ssWelding)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Structural Steel - Welding, as per BC 1704.3.1
                </h2>
              </div>
              {ssWelding && (
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Welding Operator: To Provide
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.weldingOperator}
                        onChange={(e) =>
                          handleWeldingChange("weldingOperator", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        License #: To Provide
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.licenseNumber}
                        onChange={(e) =>
                          handleWeldingChange("licenseNumber", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Exp Date:
                      </label>
                      <input
                        type="date"
                        value={formData.structuralSteelWelding.expDate}
                        onChange={(e) =>
                          handleWeldingChange("expDate", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Shop or Field Welded:
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelWelding.shopOrField ===
                            "shop"
                          }
                          onChange={() =>
                            handleWeldingChange("shopOrField", "shop")
                          }
                          className="mr-2"
                        />
                        Shop
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelWelding.shopOrField ===
                            "field"
                          }
                          onChange={() =>
                            handleWeldingChange("shopOrField", "field")
                          }
                          className="mr-2"
                        />
                        Field
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Welding Procedure Specification:
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              formData.structuralSteelWelding
                                .weldingProcedureSpec.toBeReceived
                            }
                            onChange={() =>
                              handleSpecificationChange(
                                "weldingProcedureSpec",
                                "toBeReceived"
                              )
                            }
                            className="mr-2"
                          />
                          To be Received
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              formData.structuralSteelWelding
                                .weldingProcedureSpec.received
                            }
                            onChange={() =>
                              handleSpecificationChange(
                                "weldingProcedureSpec",
                                "received"
                              )
                            }
                            className="mr-2"
                          />
                          Received
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Structural Steel Specification:
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              formData.structuralSteelWelding
                                .structuralSteelSpec.toBeReceived
                            }
                            onChange={() =>
                              handleSpecificationChange(
                                "structuralSteelSpec",
                                "toBeReceived"
                              )
                            }
                            className="mr-2"
                          />
                          To be Received
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={
                              formData.structuralSteelWelding
                                .structuralSteelSpec.received
                            }
                            onChange={() =>
                              handleSpecificationChange(
                                "structuralSteelSpec",
                                "received"
                              )
                            }
                            className="mr-2"
                          />
                          Received
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Type & Capacity of Machine:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.machineType}
                        onChange={(e) =>
                          handleWeldingChange("machineType", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Electrodes:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.electrodes}
                        onChange={(e) =>
                          handleWeldingChange("electrodes", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Polarity:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.polarity}
                        onChange={(e) =>
                          handleWeldingChange("polarity", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Sizes:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.sizes}
                        onChange={(e) =>
                          handleWeldingChange("sizes", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Weld Size:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.weldSize}
                        onChange={(e) =>
                          handleWeldingChange("weldSize", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Type of Welds:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.typeOfWelds}
                        onChange={(e) =>
                          handleWeldingChange("typeOfWelds", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Layer of Beads:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.layerOfBeads}
                        onChange={(e) =>
                          handleWeldingChange("layerOfBeads", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Welding Position Used:
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            formData.structuralSteelWelding.weldingPosition.flat
                          }
                          onChange={() => handleWeldingPositionChange("flat")}
                          className="mr-2"
                        />
                        Flat
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            formData.structuralSteelWelding.weldingPosition
                              .horizontal
                          }
                          onChange={() =>
                            handleWeldingPositionChange("horizontal")
                          }
                          className="mr-2"
                        />
                        Horizontal
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            formData.structuralSteelWelding.weldingPosition
                              .vertical
                          }
                          onChange={() =>
                            handleWeldingPositionChange("vertical")
                          }
                          className="mr-2"
                        />
                        Vertical
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            formData.structuralSteelWelding.weldingPosition
                              .overhead
                          }
                          onChange={() =>
                            handleWeldingPositionChange("overhead")
                          }
                          className="mr-2"
                        />
                        Overhead
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Total Lineal Inches of Welds Made:
                      </label>
                      <input
                        type="text"
                        value={
                          formData.structuralSteelWelding.totalLinealInches
                        }
                        onChange={(e) =>
                          handleWeldingChange(
                            "totalLinealInches",
                            e.target.value
                          )
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Accepted:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.accepted}
                        onChange={(e) =>
                          handleWeldingChange("accepted", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Rejected:
                      </label>
                      <input
                        type="text"
                        value={formData.structuralSteelWelding.rejected}
                        onChange={(e) =>
                          handleWeldingChange("rejected", e.target.value)
                        }
                        className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Complete Joint Penetration Locations:
                    </label>
                    <input
                      type="text"
                      value={
                        formData.structuralSteelWelding
                          .completeJointPenetrationLocations
                      }
                      onChange={(e) =>
                        handleWeldingChange(
                          "completeJointPenetrationLocations",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Partial Joint Penetration Locations:
                    </label>
                    <input
                      type="text"
                      value={
                        formData.structuralSteelWelding
                          .partialJointPenetrationLocations
                      }
                      onChange={(e) =>
                        handleWeldingChange(
                          "partialJointPenetrationLocations",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Non-destructive tests and locations:
                    </label>
                    <input
                      type="text"
                      value={
                        formData.structuralSteelWelding.nonDestructiveTests
                      }
                      onChange={(e) =>
                        handleWeldingChange(
                          "nonDestructiveTests",
                          e.target.value
                        )
                      }
                      className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Comments:
                    </label>
                    <textarea
                      value={formData.structuralSteelWelding.comments}
                      onChange={(e) =>
                        handleWeldingChange("comments", e.target.value)
                      }
                      className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Structural Steel - Details Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setSsDetails(!ssDetails)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Structural Steel - Details, as per BC 1704.3.2
                </h2>
              </div>
              {ssDetails && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Approved shop drawings */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Approved shop drawings for field deviations on site
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.approvedShopDrawings
                              .approved
                          }
                          onChange={() =>
                            handleSteelDetailsChange(
                              "approvedShopDrawings",
                              "A"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.approvedShopDrawings
                              .disapproved
                          }
                          onChange={() =>
                            handleSteelDetailsChange(
                              "approvedShopDrawings",
                              "D"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.approvedShopDrawings
                              .notApplicable
                          }
                          onChange={() =>
                            handleSteelDetailsChange(
                              "approvedShopDrawings",
                              "NA"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Bracing and stiffening */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Bracing and stiffening of structural members
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.bracingAndStiffening
                              .approved
                          }
                          onChange={() =>
                            handleSteelDetailsChange(
                              "bracingAndStiffening",
                              "A"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.bracingAndStiffening
                              .disapproved
                          }
                          onChange={() =>
                            handleSteelDetailsChange(
                              "bracingAndStiffening",
                              "D"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.bracingAndStiffening
                              .notApplicable
                          }
                          onChange={() =>
                            handleSteelDetailsChange(
                              "bracingAndStiffening",
                              "NA"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Location of members */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Location of members consistent with plans
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.locationOfMembers
                              .approved
                          }
                          onChange={() =>
                            handleSteelDetailsChange("locationOfMembers", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.locationOfMembers
                              .disapproved
                          }
                          onChange={() =>
                            handleSteelDetailsChange("locationOfMembers", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.locationOfMembers
                              .notApplicable
                          }
                          onChange={() =>
                            handleSteelDetailsChange("locationOfMembers", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Joint details */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Joint details at each connection
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.jointDetails
                              .approved
                          }
                          onChange={() =>
                            handleSteelDetailsChange("jointDetails", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.jointDetails
                              .disapproved
                          }
                          onChange={() =>
                            handleSteelDetailsChange("jointDetails", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.jointDetails
                              .notApplicable
                          }
                          onChange={() =>
                            handleSteelDetailsChange("jointDetails", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Seismic design */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">Seismic design implemented</div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.seismicDesign
                              .approved
                          }
                          onChange={() =>
                            handleSteelDetailsChange("seismicDesign", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.seismicDesign
                              .disapproved
                          }
                          onChange={() =>
                            handleSteelDetailsChange("seismicDesign", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelDetails.seismicDesign
                              .notApplicable
                          }
                          onChange={() =>
                            handleSteelDetailsChange("seismicDesign", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.structuralSteelDetails.comments}
                        onChange={(e) =>
                          handleSteelDetailsChange("comments", e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Structural Steel - High Strength Bolting Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setSsBolting(!ssBolting)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Structural Steel - High Strength Bolting, as per BC 1704.3.3
                </h2>
              </div>
              {ssBolting && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Required approved shop drawings */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Required approved shop drawings and submittals are
                        available
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.shopDrawings
                              ?.approved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("shopDrawings", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.shopDrawings
                              ?.disapproved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("shopDrawings", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.shopDrawings
                              ?.notApplicable
                          }
                          onChange={() =>
                            handleSteelBoltingChange("shopDrawings", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Assembly mill tests */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Assembly (bolts, nuts and washers) mill tests reports
                        are available
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.millTests?.approved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("millTests", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.millTests
                              ?.disapproved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("millTests", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.millTests
                              ?.notApplicable
                          }
                          onChange={() =>
                            handleSteelBoltingChange("millTests", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Installed bolts */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Installed bolts are minimum flush with the nuts
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.installedBolts
                              ?.approved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("installedBolts", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.installedBolts
                              ?.disapproved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("installedBolts", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.installedBolts
                              ?.notApplicable
                          }
                          onChange={() =>
                            handleSteelBoltingChange("installedBolts", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Slip-critical connections */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Slip-critical connections have all faying surfaces clean
                        and meet mill scale requirements
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.slipCritical
                              ?.approved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("slipCritical", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.slipCritical
                              ?.disapproved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("slipCritical", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.slipCritical
                              ?.notApplicable
                          }
                          onChange={() =>
                            handleSteelBoltingChange("slipCritical", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Connections tightened */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Connections have been tightened in the proper sequence
                        so as not to loosen bolts previously tightened
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting
                              ?.connectionsTightened?.approved
                          }
                          onChange={() =>
                            handleSteelBoltingChange(
                              "connectionsTightened",
                              "A"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting
                              ?.connectionsTightened?.disapproved
                          }
                          onChange={() =>
                            handleSteelBoltingChange(
                              "connectionsTightened",
                              "D"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting
                              ?.connectionsTightened?.notApplicable
                          }
                          onChange={() =>
                            handleSteelBoltingChange(
                              "connectionsTightened",
                              "NA"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Bolts properly stored */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Bolts are properly stored, containers sealed at end of
                        day, protected from weather and elements
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.boltsStored
                              ?.approved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("boltsStored", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.boltsStored
                              ?.disapproved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("boltsStored", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.boltsStored
                              ?.notApplicable
                          }
                          onChange={() =>
                            handleSteelBoltingChange("boltsStored", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Joints snug-tight */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Joints brought to the snug-tight condition prior to the
                        pretensioning operation
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.jointsSnugTight
                              ?.approved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("jointsSnugTight", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.jointsSnugTight
                              ?.disapproved
                          }
                          onChange={() =>
                            handleSteelBoltingChange("jointsSnugTight", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.structuralSteelBolting?.jointsSnugTight
                              ?.notApplicable
                          }
                          onChange={() =>
                            handleSteelBoltingChange("jointsSnugTight", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.structuralSteelBolting.comments}
                        onChange={(e) =>
                          handleSteelBoltingChange("comments", e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mechanical Systems Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setMs(!ms)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Mechanical Systems, as per BC 1704.16
                </h2>
              </div>
              {ms && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Systems complete */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Systems are complete in accordance with mfrs guidelines
                        and approved documents
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.systemsComplete.approved
                          }
                          onChange={() =>
                            handleMechanicalChange("systemsComplete", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.systemsComplete
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("systemsComplete", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.systemsComplete
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("systemsComplete", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Supports and bracing */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Supports, hangers, bracing, and vibration isolation are
                        properly spaced and anchored
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.supportsAndBracing
                              .approved
                          }
                          onChange={() =>
                            handleMechanicalChange("supportsAndBracing", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.supportsAndBracing
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("supportsAndBracing", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.supportsAndBracing
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("supportsAndBracing", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Required signage */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Required signage and safety instructions are present
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.requiredSignage.approved
                          }
                          onChange={() =>
                            handleMechanicalChange("requiredSignage", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.requiredSignage
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("requiredSignage", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.requiredSignage
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("requiredSignage", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Electrical and Fire Alarm */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Verified Electrical and Fire Alarm work related to HVAC
                        installation have been installed and signed off
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.electricalAndFireAlarm
                              .approved
                          }
                          onChange={() =>
                            handleMechanicalChange(
                              "electricalAndFireAlarm",
                              "A"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.electricalAndFireAlarm
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange(
                              "electricalAndFireAlarm",
                              "D"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.electricalAndFireAlarm
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange(
                              "electricalAndFireAlarm",
                              "NA"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Ventilation balancing */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Ventilation balancing report is complete and in
                        accordance with design
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.ventilationBalancing
                              .approved
                          }
                          onChange={() =>
                            handleMechanicalChange("ventilationBalancing", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.ventilationBalancing
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("ventilationBalancing", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.ventilationBalancing
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("ventilationBalancing", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Required labeling */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">Required labeling is present</div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.requiredLabeling.approved
                          }
                          onChange={() =>
                            handleMechanicalChange("requiredLabeling", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.requiredLabeling
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("requiredLabeling", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.requiredLabeling
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("requiredLabeling", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Noise compliance */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Noise producing equipment within 100 feet of habitable
                        window shall be tested for compliance to code
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.noiseCompliance.approved
                          }
                          onChange={() =>
                            handleMechanicalChange("noiseCompliance", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.noiseCompliance
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("noiseCompliance", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.noiseCompliance
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("noiseCompliance", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Fire dampers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Required fire and fire smoke dampers have been installed
                        and are functioning properly
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.fireDampers.approved
                          }
                          onChange={() =>
                            handleMechanicalChange("fireDampers", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.fireDampers.disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("fireDampers", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.fireDampers.notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("fireDampers", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Installed unit */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Installed unit and DOB approved drawings match for
                        Equipment Use Permits (EUPs)
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.installedUnit.approved
                          }
                          onChange={() =>
                            handleMechanicalChange("installedUnit", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.installedUnit.disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("installedUnit", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.installedUnit
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("installedUnit", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Air balancing test */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Witnessed air balancing test performed using currently
                        calibrated equipment
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.airBalancingTest.approved
                          }
                          onChange={() =>
                            handleMechanicalChange("airBalancingTest", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.airBalancingTest
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("airBalancingTest", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.airBalancingTest
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("airBalancingTest", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Materials approved */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        All materials used are approved
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.materialsApproved
                              .approved
                          }
                          onChange={() =>
                            handleMechanicalChange("materialsApproved", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.materialsApproved
                              .disapproved
                          }
                          onChange={() =>
                            handleMechanicalChange("materialsApproved", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.mechanicalSystems.materialsApproved
                              .notApplicable
                          }
                          onChange={() =>
                            handleMechanicalChange("materialsApproved", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Test inspection equipment */}
                    <div className="mt-6">
                      <div className="font-medium mb-4">
                        Test inspection equipment used (verified using currently
                        certified calibration):
                      </div>

                      {/* Balometer */}
                      <div className="flex items-center gap-6 mb-2">
                        <div className="w-48">
                          Balometer used for air readings
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.mechanicalSystems.testEquipment.balometer
                                .contractor
                            }
                            onChange={() =>
                              handleMechanicalTestEquipment(
                                "balometer",
                                "contractor"
                              )
                            }
                            className="mr-2"
                          />
                          Contractor&apos;s
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.mechanicalSystems.testEquipment.balometer
                                .amaa
                            }
                            onChange={() =>
                              handleMechanicalTestEquipment("balometer", "amaa")
                            }
                            className="mr-2"
                          />
                          AMAA&apos;s
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.mechanicalSystems.testEquipment.balometer
                                .notApplicable
                            }
                            onChange={() =>
                              handleMechanicalTestEquipment(
                                "balometer",
                                "notApplicable"
                              )
                            }
                            className="mr-2"
                          />
                          Not Applicable
                        </label>
                      </div>

                      {/* Noise meter */}
                      <div className="flex items-center gap-6 mb-2">
                        <div className="w-48">
                          Octave band noise level meter
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.mechanicalSystems.testEquipment
                                .noiseMeter.contractor
                            }
                            onChange={() =>
                              handleMechanicalTestEquipment(
                                "noiseMeter",
                                "contractor"
                              )
                            }
                            className="mr-2"
                          />
                          Contractor&apos;s
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.mechanicalSystems.testEquipment
                                .noiseMeter.notApplicable
                            }
                            onChange={() =>
                              handleMechanicalTestEquipment(
                                "noiseMeter",
                                "notApplicable"
                              )
                            }
                            className="mr-2"
                          />
                          Not Applicable
                        </label>
                      </div>

                      {/* Smoke test */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="w-48">Smoke test equipment</div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.mechanicalSystems.testEquipment.smokeTest
                                .contractor
                            }
                            onChange={() =>
                              handleMechanicalTestEquipment(
                                "smokeTest",
                                "contractor"
                              )
                            }
                            className="mr-2"
                          />
                          Contractor&apos;s
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.mechanicalSystems.testEquipment.smokeTest
                                .notApplicable
                            }
                            onChange={() =>
                              handleMechanicalTestEquipment(
                                "smokeTest",
                                "notApplicable"
                              )
                            }
                            className="mr-2"
                          />
                          Not Applicable
                        </label>
                      </div>

                      {/* Serial number */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Serial or certification number of calibrated
                          equipment:
                        </label>
                        <input
                          type="text"
                          value={formData.mechanicalSystems.serialNumber}
                          onChange={(e) =>
                            handleMechanicalSerialNumber(e.target.value)
                          }
                          className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.mechanicalSystems.comments}
                        onChange={(e) =>
                          handleMechanicalCommentChange(e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sprinkler Systems Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setSprinkler(!sprinkler)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Sprinkler Systems, as per BC 1704.23
                </h2>
              </div>
              {sprinkler && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Installation */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Installation per NYC BC and NFPA 13
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.installation.approved
                          }
                          onChange={() =>
                            handleSprinklerChange("installation", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.installation.disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange("installation", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.installation.notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange("installation", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Correct number of heads */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">Correct number of heads</div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.correctHeads.approved
                          }
                          onChange={() =>
                            handleSprinklerChange("correctHeads", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.correctHeads.disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange("correctHeads", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.correctHeads.notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange("correctHeads", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Head spacing */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">Head spacing</div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.headSpacing.approved
                          }
                          onChange={() =>
                            handleSprinklerChange("headSpacing", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.headSpacing.disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange("headSpacing", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.headSpacing.notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange("headSpacing", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Spray pattern */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">Spray pattern</div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.sprayPattern.approved
                          }
                          onChange={() =>
                            handleSprinklerChange("sprayPattern", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.sprayPattern.disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange("sprayPattern", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.sprayPattern.notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange("sprayPattern", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Hanging and supports */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Hanging, supports and bracing
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.hangingAndSupports
                              .approved
                          }
                          onChange={() =>
                            handleSprinklerChange("hangingAndSupports", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.hangingAndSupports
                              .disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange("hangingAndSupports", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.hangingAndSupports
                              .notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange("hangingAndSupports", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Observe and record */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Observe and record all testing - Exemption (by DOB)
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.observeAndRecord.approved
                          }
                          onChange={() =>
                            handleSprinklerChange("observeAndRecord", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.observeAndRecord
                              .disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange("observeAndRecord", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.observeAndRecord
                              .notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange("observeAndRecord", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Materials approved */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Materials as per approved documents
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.materialsApproved.approved
                          }
                          onChange={() =>
                            handleSprinklerChange("materialsApproved", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.materialsApproved
                              .disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange("materialsApproved", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.materialsApproved
                              .notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange("materialsApproved", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Maintenance instructions */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Maintenance and instructions to owner
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.maintenanceInstructions
                              .approved
                          }
                          onChange={() =>
                            handleSprinklerChange(
                              "maintenanceInstructions",
                              "A"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.maintenanceInstructions
                              .disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange(
                              "maintenanceInstructions",
                              "D"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.maintenanceInstructions
                              .notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange(
                              "maintenanceInstructions",
                              "NA"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Certification forms */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Material and test certification forms to DOB and FDNY
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.certificationForms
                              .approved
                          }
                          onChange={() =>
                            handleSprinklerChange("certificationForms", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.certificationForms
                              .disapproved
                          }
                          onChange={() =>
                            handleSprinklerChange("certificationForms", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.sprinklerSystems.certificationForms
                              .notApplicable
                          }
                          onChange={() =>
                            handleSprinklerChange("certificationForms", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Test inspection equipment */}
                    <div className="mt-6">
                      <div className="font-medium mb-4">
                        Test inspection equipment used (verified using currently
                        certified calibration):
                      </div>

                      {/* Pressure gauge */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="w-48">Pressure gauge</div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.sprinklerSystems.testEquipment
                                .pressureGauge.contractor
                            }
                            onChange={() =>
                              handleSprinklerTestEquipment("contractor")
                            }
                            className="mr-2"
                          />
                          Contractor&apos;s
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.sprinklerSystems.testEquipment
                                .pressureGauge.amaa
                            }
                            onChange={() =>
                              handleSprinklerTestEquipment("amaa")
                            }
                            className="mr-2"
                          />
                          AMAA&apos;s
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.sprinklerSystems.testEquipment
                                .pressureGauge.notApplicable
                            }
                            onChange={() =>
                              handleSprinklerTestEquipment("notApplicable")
                            }
                            className="mr-2"
                          />
                          Not Applicable
                        </label>
                      </div>

                      {/* Serial number */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Serial or certification number of calibrated
                          equipment:
                        </label>
                        <input
                          type="text"
                          value={formData.sprinklerSystems.serialNumber}
                          onChange={(e) =>
                            handleSprinklerSerialNumber(e.target.value)
                          }
                          className="w-full border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.sprinklerSystems.comments}
                        onChange={(e) =>
                          handleSprinklerCommentChange(e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Heating Systems Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setHeating(!heating)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Heating Systems, as per BC 1704.25
                </h2>
              </div>
              {heating && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Comments Section */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.heatingSystems.comments}
                        onChange={(e) =>
                          handleHeatingCommentChange(e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fire-Resistant Penetrations and Joints Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setFireResistance(!fireResistance)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Fire-Resistant Penetrations and Joints, as per BC 1704.27
                </h2>
              </div>
              {fireResistance && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Fire-rated walls */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Penetrations of fire-rated walls properly sealed with
                        approved materials
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.fireRatedWalls
                              .approved
                          }
                          onChange={() =>
                            handlePenetrationsChange("fireRatedWalls", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.fireRatedWalls
                              .disapproved
                          }
                          onChange={() =>
                            handlePenetrationsChange("fireRatedWalls", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.fireRatedWalls
                              .notApplicable
                          }
                          onChange={() =>
                            handlePenetrationsChange("fireRatedWalls", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Floors */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Penetrations of floors properly sealed with approved
                        materials
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.floors.approved
                          }
                          onChange={() =>
                            handlePenetrationsChange("floors", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.floors
                              .disapproved
                          }
                          onChange={() =>
                            handlePenetrationsChange("floors", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.floors
                              .notApplicable
                          }
                          onChange={() =>
                            handlePenetrationsChange("floors", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Construction joints */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Construction joints have properly sealed with approved
                        materials
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations
                              .constructionJoints.approved
                          }
                          onChange={() =>
                            handlePenetrationsChange("constructionJoints", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations
                              .constructionJoints.disapproved
                          }
                          onChange={() =>
                            handlePenetrationsChange("constructionJoints", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations
                              .constructionJoints.notApplicable
                          }
                          onChange={() =>
                            handlePenetrationsChange("constructionJoints", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Draftstopping */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Draftstopping installed in approved manner
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.draftstopping
                              .approved
                          }
                          onChange={() =>
                            handlePenetrationsChange("draftstopping", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.draftstopping
                              .disapproved
                          }
                          onChange={() =>
                            handlePenetrationsChange("draftstopping", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.draftstopping
                              .notApplicable
                          }
                          onChange={() =>
                            handlePenetrationsChange("draftstopping", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Fireblocking */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Fireblocking installed in approved manner
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.fireblocking
                              .approved
                          }
                          onChange={() =>
                            handlePenetrationsChange("fireblocking", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.fireblocking
                              .disapproved
                          }
                          onChange={() =>
                            handlePenetrationsChange("fireblocking", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistantPenetrations.fireblocking
                              .notApplicable
                          }
                          onChange={() =>
                            handlePenetrationsChange("fireblocking", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.fireResistantPenetrations.comments}
                        onChange={(e) =>
                          handlePenetrationsCommentChange(e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Post-Installed Anchors Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setAnchors(!anchors)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Post-Installed Anchors (BB# 2014-018, 2014-019), as per BC
                  1704.32
                </h2>
              </div>
              {anchors && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Storage */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Storage and preparation of anchors
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.storage.approved
                          }
                          onChange={() => handleAnchorsChange("storage", "A")}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.storage.disapproved
                          }
                          onChange={() => handleAnchorsChange("storage", "D")}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.storage.notApplicable
                          }
                          onChange={() => handleAnchorsChange("storage", "NA")}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Placement */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Placement, type, size and location
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.placement.approved
                          }
                          onChange={() => handleAnchorsChange("placement", "A")}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.placement.disapproved
                          }
                          onChange={() => handleAnchorsChange("placement", "D")}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.placement
                              .notApplicable
                          }
                          onChange={() =>
                            handleAnchorsChange("placement", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Labeling */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Labeling of expansion, undercut, adhesive or screw
                        anchors
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.labeling.approved
                          }
                          onChange={() => handleAnchorsChange("labeling", "A")}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.labeling.disapproved
                          }
                          onChange={() => handleAnchorsChange("labeling", "D")}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.labeling.notApplicable
                          }
                          onChange={() => handleAnchorsChange("labeling", "NA")}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Evaluation report */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Evaluation report per AC193 and/or AC308
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.evaluationReport
                              .approved
                          }
                          onChange={() =>
                            handleAnchorsChange("evaluationReport", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.evaluationReport
                              .disapproved
                          }
                          onChange={() =>
                            handleAnchorsChange("evaluationReport", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.evaluationReport
                              .notApplicable
                          }
                          onChange={() =>
                            handleAnchorsChange("evaluationReport", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Pre-drilled holes */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Pre-drilled holes conform to specifications
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.predrilled.approved
                          }
                          onChange={() =>
                            handleAnchorsChange("predrilled", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.predrilled.disapproved
                          }
                          onChange={() =>
                            handleAnchorsChange("predrilled", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.predrilled
                              .notApplicable
                          }
                          onChange={() =>
                            handleAnchorsChange("predrilled", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Installer certification */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Installer is certified as Adhesive Anchor Installer
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.installer.approved
                          }
                          onChange={() => handleAnchorsChange("installer", "A")}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.installer.disapproved
                          }
                          onChange={() => handleAnchorsChange("installer", "D")}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.postInstalledAnchors.installer
                              .notApplicable
                          }
                          onChange={() =>
                            handleAnchorsChange("installer", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.postInstalledAnchors.comments}
                        onChange={(e) =>
                          handleAnchorsCommentChange(e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Energy Code Compliance */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setEnergyCode(!energyCode)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Energy Code Compliance, as per BC 110.3.5
                </h2>
              </div>
              {energyCode && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Foundation insulation */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Protection of exposed foundation insulation
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.energyCodeCompliance.foundationInsulation
                              .approved
                          }
                          onChange={() =>
                            handleEnergyCodeChange("foundationInsulation", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.energyCodeCompliance.foundationInsulation
                              .disapproved
                          }
                          onChange={() =>
                            handleEnergyCodeChange("foundationInsulation", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.energyCodeCompliance.foundationInsulation
                              .notApplicable
                          }
                          onChange={() =>
                            handleEnergyCodeChange("foundationInsulation", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Add all other fields similarly */}
                    {[
                      {
                        key: "insulationPlacement",
                        label: "Insulation placement and R-values",
                      },
                      {
                        key: "fenestrationRatings",
                        label:
                          "Fenestration and door U-factor and product ratings",
                      },
                      { key: "airLeakage", label: "Fenestration air leakage" },
                      { key: "fenestrationAreas", label: "Fenestration areas" },
                      {
                        key: "airBarrierVisual",
                        label: "Air barrier – visual inspection",
                      },
                      {
                        key: "airBarrierTesting",
                        label: "Air barrier – testing",
                      },
                      {
                        key: "airBarrierContinuity",
                        label: "Air barrier continuity plan testing/inspection",
                      },
                      { key: "vestibules", label: "Vestibules" },
                      { key: "fireplaces", label: "Fireplaces" },
                      {
                        key: "ventilationSystem",
                        label: "Ventilation and air distribution system",
                      },
                      { key: "shutoffDampers", label: "Shutoff dampers" },
                      {
                        key: "hvacEquipment",
                        label: "HVAC-R and service water heating equipment",
                      },
                      {
                        key: "hvacControls",
                        label:
                          "HVAC-R and service water heating system controls",
                      },
                      {
                        key: "hvacPiping",
                        label:
                          "HVAC-R and service water piping design and insulation",
                      },
                      {
                        key: "ductLeakage",
                        label: "Duct leakage testing, insulation and design",
                      },
                      { key: "metering", label: "Metering" },
                      {
                        key: "dwellingLighting",
                        label: "Lighting in dwelling units",
                      },
                      {
                        key: "interiorLighting",
                        label: "Interior lighting power",
                      },
                      {
                        key: "exteriorLighting",
                        label: "Exterior lighting power",
                      },
                      { key: "lightingControls", label: "Lighting controls" },
                      {
                        key: "electricalMotors",
                        label: "Electrical motors and elevators",
                      },
                      {
                        key: "maintenanceInfo",
                        label: "Maintenance information",
                      },
                      {
                        key: "permanentCertificate",
                        label: "Permanent certificate",
                      },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center"
                      >
                        <div className="italic">{label}</div>
                        <div className="text-center">
                          <input
                            type="radio"
                            checked={
                              formData.energyCodeCompliance[key].approved
                            }
                            onChange={() => handleEnergyCodeChange(key, "A")}
                            className="h-4 w-4"
                          />
                        </div>
                        <div className="text-center">
                          <input
                            type="radio"
                            checked={
                              formData.energyCodeCompliance[key].disapproved
                            }
                            onChange={() => handleEnergyCodeChange(key, "D")}
                            className="h-4 w-4"
                          />
                        </div>
                        <div className="text-center">
                          <input
                            type="radio"
                            checked={
                              formData.energyCodeCompliance[key].notApplicable
                            }
                            onChange={() => handleEnergyCodeChange(key, "NA")}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.energyCodeCompliance.comments}
                        onChange={(e) =>
                          handleEnergyCodeCommentChange(e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fire-Resistance Rated Construction Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setFireResistanceRated(!fireResistanceRated)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Fire-Resistance Rated Construction, as per BC 110.3.4
                </h2>
              </div>
              {fireResistanceRated && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Fire-rated partitions */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        All fire-rated partitions comply with design and code
                        requirements
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedPartitions
                              .approved
                          }
                          onChange={() =>
                            handleFireResistanceChange(
                              "fireRatedPartitions",
                              "A"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedPartitions
                              .disapproved
                          }
                          onChange={() =>
                            handleFireResistanceChange(
                              "fireRatedPartitions",
                              "D"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedPartitions
                              .notApplicable
                          }
                          onChange={() =>
                            handleFireResistanceChange(
                              "fireRatedPartitions",
                              "NA"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Fire-rated floors */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        All fire-rated floors comply with design and code
                        requirements
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedFloors
                              .approved
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireRatedFloors", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedFloors
                              .disapproved
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireRatedFloors", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedFloors
                              .notApplicable
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireRatedFloors", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Fire-rated ceilings */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        All fire-rated ceilings comply with design and code
                        requirements
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedCeilings
                              .approved
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireRatedCeilings", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedCeilings
                              .disapproved
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireRatedCeilings", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedCeilings
                              .notApplicable
                          }
                          onChange={() =>
                            handleFireResistanceChange(
                              "fireRatedCeilings",
                              "NA"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Fire-rated shafts */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        All fire-rated shafts comply with design and code
                        requirements
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedShafts
                              .approved
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireRatedShafts", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedShafts
                              .disapproved
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireRatedShafts", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireRatedShafts
                              .notApplicable
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireRatedShafts", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Fire shutters */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        All fire shutters comply with design and code
                        requirements
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireShutters.approved
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireShutters", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireShutters
                              .disapproved
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireShutters", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.fireResistanceRated.fireShutters
                              .notApplicable
                          }
                          onChange={() =>
                            handleFireResistanceChange("fireShutters", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.fireResistanceRated.comments}
                        onChange={(e) =>
                          handleFireResistanceCommentChange(e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Final Inspection Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setFinalInspection(!finalInspection)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Final Inspection, as per BC 28-116.2.4.2 and Directive 14 of
                  1975
                </h2>
              </div>
              {finalInspection && (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Status Headers */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 mb-2">
                      <div></div>
                      <div className="text-center font-medium">A</div>
                      <div className="text-center font-medium">D</div>
                      <div className="text-center font-medium">NA</div>
                    </div>

                    {/* Construction complete */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Construction work is complete and in substantial
                        compliance with approved construction documents
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.constructionComplete
                              .approved
                          }
                          onChange={() =>
                            handleFinalInspectionChange(
                              "constructionComplete",
                              "A"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.constructionComplete
                              .disapproved
                          }
                          onChange={() =>
                            handleFinalInspectionChange(
                              "constructionComplete",
                              "D"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.constructionComplete
                              .notApplicable
                          }
                          onChange={() =>
                            handleFinalInspectionChange(
                              "constructionComplete",
                              "NA"
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Code compliance */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        All work has been built to code and complies with all
                        local laws
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.codeCompliance.approved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("codeCompliance", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.codeCompliance.disapproved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("codeCompliance", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.codeCompliance
                              .notApplicable
                          }
                          onChange={() =>
                            handleFinalInspectionChange("codeCompliance", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Inspection items */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        All required special and progress inspection items have
                        been approved
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.inspectionItems.approved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("inspectionItems", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.inspectionItems.disapproved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("inspectionItems", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.inspectionItems
                              .notApplicable
                          }
                          onChange={() =>
                            handleFinalInspectionChange("inspectionItems", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Egress paths */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Paths of egress are provided in accordance with design
                        and code requirements
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.egressPaths.approved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("egressPaths", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.egressPaths.disapproved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("egressPaths", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.egressPaths.notApplicable
                          }
                          onChange={() =>
                            handleFinalInspectionChange("egressPaths", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Exit signs */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Exit signs are in the proper location and indicate the
                        correct means of egress
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={formData.finalInspection.exitSigns.approved}
                          onChange={() =>
                            handleFinalInspectionChange("exitSigns", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.exitSigns.disapproved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("exitSigns", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.exitSigns.notApplicable
                          }
                          onChange={() =>
                            handleFinalInspectionChange("exitSigns", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* ADA compliance */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Construction complies with ADA requirements indicated on
                        drawings
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.adaCompliance.approved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("adaCompliance", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.adaCompliance.disapproved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("adaCompliance", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.adaCompliance.notApplicable
                          }
                          onChange={() =>
                            handleFinalInspectionChange("adaCompliance", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Doors direction */}
                    <div className="grid grid-cols-[1fr,40px,40px,40px] gap-2 items-center">
                      <div className="italic">
                        Doors open in the correct direction and have
                        fire-ratings indicated on drawings
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.doorsDirection.approved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("doorsDirection", "A")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.doorsDirection.disapproved
                          }
                          onChange={() =>
                            handleFinalInspectionChange("doorsDirection", "D")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="radio"
                          checked={
                            formData.finalInspection.doorsDirection
                              .notApplicable
                          }
                          onChange={() =>
                            handleFinalInspectionChange("doorsDirection", "NA")
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Comments:
                      </label>
                      <textarea
                        value={formData.finalInspection.comments}
                        onChange={(e) =>
                          handleFinalInspectionCommentChange(e.target.value)
                        }
                        className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Images and Comments Section */}
            <div className="mb-8 border rounded-lg overflow-hidden">
              <div
                className="bg-[#4A90E2] text-white p-3 cursor-pointer"
                onClick={() => setImages(!images)}
              >
                <h2 className="text-lg font-semibold text-center">
                  Comments and additional information, including photographs
                </h2>
              </div>
              {images && (
                <div className="p-4">
                  {formData.images?.map((imageGroup, groupIndex) => (
                    <div key={groupIndex} className="mb-8 relative">
                      <div className="absolute top-2 right-2 z-10">
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter(
                              (_, i) => i !== groupIndex
                            );
                            setFormData((prev) => ({
                              ...prev,
                              images: newImages,
                            }));
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                          title="Remove image group"
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
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {imageGroup.urls &&
                          imageGroup.urls.map((url, imageIndex) => (
                            <div key={imageIndex} className="relative">
                              <img
                                src={url}
                                alt={`Uploaded image ${groupIndex + 1}-${
                                  imageIndex + 1
                                }`}
                                className="w-full h-auto rounded-lg"
                              />
                            </div>
                          ))}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Comments/Information about these images:
                        </label>
                        <textarea
                          value={imageGroup.comment || ""}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[groupIndex].comment = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              images: newImages,
                            }));
                          }}
                          className="w-full h-32 border rounded-md p-2 focus:border-[#4A90E2] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add image button - moved inside and centered */}
                  <div className="flex justify-center mt-6 mb-4">
                    <button
                      type="button"
                      onClick={() => setShowImageOptions(!showImageOptions)}
                      className="bg-[#4A90E2] text-white px-4 py-2 rounded hover:bg-[#357ABD] transition-colors"
                    >
                      Add image
                    </button>
                  </div>

                  {showImageOptions && (
                    <div className="mt-4 space-y-2 max-w-md mx-auto">
                      <button
                        type="button"
                        onClick={handleImageCapture}
                        className="block w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                      >
                        <span className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Take image with camera
                        </span>
                      </button>
                      <label className="block w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <span className="block w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-center cursor-pointer flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 00-3-3H8zm7 7a3 3 0 01-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3H8a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a3 3 0 01-6 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Choose image from gallery
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#4A90E2] text-white px-6 py-2 rounded hover:bg-[#357ABD] transition-colors w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
