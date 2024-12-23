import mongoose from "mongoose";

const inspectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["PROGRESS", "FINAL"],
      required: true,
    },
    inspectorEmail: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    amaaProjectNumber: {
      type: String,
      required: true,
    },
    sentTo: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    cityCounty: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeArrived: {
      type: String,
      required: true,
    },
    timeDeparted: {
      type: String,
      required: true,
    },
    personsMet: {
      type: String,
      required: true,
    },
    dobApplication: {
      type: String,
      required: true,
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
      shopOrFieldWelded: String,
      weldingProcedureSpecification: [String],
      structuralSteelSpecification: [String],
      machineTypeCapacity: String,
      electrodes: String,
      polarity: String,
      sizes: String,
      weldSize: String,
      typeOfWelds: String,
      layerOfBeads: String,
      weldingPositionUsed: [String],
      totalLinealInches: String,
      accepted: String,
      rejected: String,
      completeJointPenetrationLocations: String,
      partialJointPenetrationLocations: String,
      nonDestructiveTests: String,
      comments: String,
    },
    structuralSteelDetails: {
      approvedShopDrawings: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      bracingStiffening: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      locationMembers: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      jointDetails: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      seismicDesign: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      comments: String,
    },
    structuralSteelBolting: {
      approvedShopDrawings: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      assemblyMillTests: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      boltsFlushWithNuts: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      slipCriticalConnections: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      connectionsTightened: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      boltsProperlyStored: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      jointsSnugTight: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      comments: String,
    },
    mechanicalSystems: {
      systemsComplete: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      supportsBracing: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      requiredSignage: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      electricalFireAlarm: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      ventilationBalancing: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      requiredLabeling: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      noiseCompliance: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      fireDampers: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      installedUnit: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      airBalancingTest: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      materialsApproved: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      comments: String,
    },
    sprinklerSystems: {
      installationPerCode: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      correctHeadNumber: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      headSpacing: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      sprayPattern: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      hangingSupports: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      observeRecordTesting: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      materialsApproved: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      maintenanceInstructions: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      certificationForms: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      comments: String,
    },
    heatingSystems: {
      comments: String,
    },
    fireResistantPenetrations: {
      penetrationsFireRatedWalls: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      penetrationsFloors: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      constructionJoints: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      draftstopping: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      fireblocking: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      comments: String,
    },
    postInstalledAnchors: {
      storagePreparation: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      placementTypeSize: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      labelingAnchors: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      evaluationReport: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      predrillHoles: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      installerCertification: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      comments: String,
    },
    energyCodeCompliance: {
      foundationInsulation: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      insulationPlacement: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      fenestrationRatings: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      fenestrationLeakage: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      fenestrationAreas: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      comments: String,
    },
    fireResistanceRated: {
      fireResistanceWalls: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      floors: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      constructionJoints: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      draftstopping: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      fireblocking: {
        approved: Boolean,
        disapproved: Boolean,
        notApplicable: Boolean,
        comments: String,
      },
      comments: String,
    },
    finalInspection: {
      approved: Boolean,
      disapproved: Boolean,
      notApplicable: Boolean,
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
