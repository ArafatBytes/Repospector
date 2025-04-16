import mongoose from "mongoose";

const inspectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportType: {
      type: String,
      enum: ["INCOMPLETE_WORK", "COMPLETE", "CONFORMANCE", "NON_CONFORMANCE"],
    },
    nonConformanceReason: {
      type: String,
      required: function () {
        return this.reportType === "NON_CONFORMANCE";
      },
    },
    inspectorEmail: {
      type: String,
    },
    client: {
      type: String,
    },
    amaaProjectNumber: {
      type: String,
    },
    sentTo: {
      type: String,
    },
    projectName: {
      type: String,
    },
    cityCounty: {
      type: String,
    },
    address: {
      type: String,
    },
    floor: {
      type: String,
    },
    date: {
      type: Date,
    },
    timeArrived: {
      type: String,
    },
    timeDeparted: {
      type: String,
    },
    personsMet: {
      type: String,
    },
    dobApplication: {
      type: String,
    },
    inspectionItems: [
      {
        name: String,
        approved: Boolean,
        seeComments: Boolean,
      },
    ],
    healthSafetyPlan: {
      planRead: Boolean,
      inJobFile: Boolean,
      seenAtJobSite: Boolean,
    },
    structuralSteelWelding: {
      weldingOperator: String,
      licenseNumber: String,
      expDate: Date,
      shopOrField: String,
      weldingProcedureSpec: {
        toBeReceived: Boolean,
        received: Boolean,
      },
      structuralSteelSpec: {
        toBeReceived: Boolean,
        received: Boolean,
      },
      machineType: String,
      electrodes: String,
      polarity: String,
      sizes: String,
      weldSize: String,
      typeOfWelds: String,
      layerOfBeads: String,
      weldingPosition: {
        flat: Boolean,
        horizontal: Boolean,
        vertical: Boolean,
        overhead: Boolean,
      },
      totalLinealInches: String,
      accepted: String,
      rejected: String,
      completeJointPenetrationLocations: String,
      partialJointPenetrationLocations: String,
      nonDestructiveTests: String,
      testEquipment: {
        ultrasonicTest: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
        magneticParticle: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
        dyePenetrant: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
      },
      comments: String,
    },
    structuralSteelDetails: {
      approvedShopDrawings: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      bracingAndStiffening: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      locationOfMembers: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      jointDetails: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      seismicDesign: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      comments: String,
    },
    structuralSteelBolting: {
      shopDrawings: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      millTests: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      installedBolts: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      slipCritical: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      connectionsTightened: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      boltsStored: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      jointsSnugTight: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      comments: String,
    },
    mechanicalSystems: {
      systemsComplete: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      supportsAndBracing: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      requiredSignage: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      electricalAndFireAlarm: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      ventilationBalancing: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      requiredLabeling: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      noiseCompliance: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fireDampers: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      installedUnit: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      airBalancingTest: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      materialsApproved: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      testEquipment: {
        balometer: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
        noiseMeter: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
        smokeTest: {
          contractor: Boolean,
          notApplicable: Boolean,
        },
      },
      serialNumber: String,
      comments: String,
    },
    sprinklerSystems: {
      installation: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      correctHeads: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      headSpacing: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      sprayPattern: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      hangingAndSupports: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      observeAndRecord: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      materialsApproved: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      maintenanceInstructions: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      certificationForms: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      testEquipment: {
        pressureGauge: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
      },
      serialNumber: String,
      comments: String,
    },
    heatingSystems: {
      comments: String,
    },
    fireResistantPenetrations: {
      fireRatedWalls: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      floors: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      constructionJoints: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      draftstopping: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fireblocking: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      comments: String,
    },
    postInstalledAnchors: {
      storage: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      placement: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      labeling: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      evaluationReport: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      predrilled: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      installer: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      comments: String,
    },
    energyCodeCompliance: {
      foundationInsulation: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      insulationPlacement: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fenestrationRatings: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      airLeakage: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fenestrationAreas: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      airBarrierVisual: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      airBarrierTesting: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      airBarrierContinuity: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      vestibules: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fireplaces: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      ventilationSystem: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      shutoffDampers: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      hvacEquipment: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      hvacControls: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      hvacPiping: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      ductLeakage: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      metering: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      dwellingLighting: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      interiorLighting: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      exteriorLighting: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      lightingControls: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      electricalMotors: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      maintenanceInfo: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      permanentCertificate: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      testEquipment: {
        blowerDoor: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
        infraredCamera: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
        smokeTest: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
        lightMeter: {
          contractor: Boolean,
          amaa: Boolean,
          notApplicable: Boolean,
        },
      },
      serialNumber: String,
      comments: String,
    },
    fireResistanceRated: {
      fireRatedPartitions: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fireRatedFloors: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fireRatedCeilings: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fireRatedShafts: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      fireShutters: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      comments: String,
    },
    finalInspection: {
      constructionComplete: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      codeCompliance: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      inspectionItems: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      egressPaths: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      exitSigns: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      adaCompliance: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      doorsDirection: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
      },
      comments: String,
    },
    images: [
      {
        urls: [String],
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Inspection =
  mongoose.models.Inspection || mongoose.model("Inspection", inspectionSchema);

export default Inspection;
