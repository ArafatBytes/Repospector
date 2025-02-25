import mongoose from "mongoose";

const photographSchema = new mongoose.Schema({
  image: String,
  caption: String,
});

const checklistSchema = new mongoose.Schema({
  shopDrawings: String,
  shopDrawingsDetails: String,
  gradeOfSteel: String,
  gradeOfSteelDetails: String,
  spacingCoordinated: String,
  spacingCoordinatedDetails: String,
  requiredClearance: String,
  requiredClearanceDetails: String,
  lengthOfSplices: String,
  lengthOfSplicesDetails: String,
  bendsWithinRadii: String,
  bendsWithinRadiiDetails: String,
  additionalBars: String,
  additionalBarsDetails: String,
  barsCleaned: String,
  barsCleanedDetails: String,
  dowelsForMarginal: String,
  dowelsForMarginalDetails: String,
  barsTiedAndSupported: String,
  barsTiedAndSupportedDetails: String,
  spacersTieWires: String,
  spacersTieWiresDetails: String,
  conduitSeparated: String,
  conduitSeparatedDetails: String,
  noConduitBelow: String,
  noConduitBelowDetails: String,
  noContactWithMetals: String,
  noContactWithMetalsDetails: String,
  barNotNearSurface: String,
  barNotNearSurfaceDetails: String,
  adequateClearance: String,
  adequateClearanceDetails: String,
  specialCoating: String,
  specialCoatingDetails: String,
  noBentBars: String,
  noBentBarsDetails: String,
  noBoxingOut: String,
  noBoxingOutDetails: String,
});

const concreteReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic Info
    client: {
      type: String,
      required: true,
    },
    inspectionDate: {
      type: Date,
      required: true,
    },
    projectSiteAddress: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    inspectorName: {
      type: String,
      required: true,
    },
    timeInOut: {
      type: String,
      required: true,
    },
    reportNumber: {
      type: String,
      required: true,
    },
    siteWeather: {
      type: String,
      required: true,
    },

    // Site Contact
    siteContact: {
      type: String,
      required: true,
    },

    // Plans Referenced
    plansReferenced: {
      type: String,
      required: true,
    },

    // Area/Location Inspected
    areaInspected: {
      type: String,
      required: true,
    },

    // Material Used/Submittal Approved
    materialUsed: {
      type: String,
      required: true,
    },

    // Inspection Outcome
    inspectionOutcome: {
      type: String,
      enum: ["INCOMPLETE", "CONFORMANCE", "NON_CONFORMANCE"],
      required: true,
    },
    nonConformanceNotes: {
      type: String,
      default: "",
    },

    // Attachments
    hasPhotographs: {
      type: Boolean,
      default: true,
    },
    hasObservations: {
      type: Boolean,
      default: true,
    },

    // Photographs
    photographs: [photographSchema],

    // Checklist
    checklist: checklistSchema,

    // Inspection Observations/Remarks
    remarks: {
      type: String,
      default: "",
    },

    // Report Type (for dashboard filtering)
    reportType: {
      type: String,
      default: "CONCRETE",
    },
  },
  {
    timestamps: true,
  }
);

const ConcreteReport =
  mongoose.models.ConcreteReport ||
  mongoose.model("ConcreteReport", concreteReportSchema);

export default ConcreteReport;
