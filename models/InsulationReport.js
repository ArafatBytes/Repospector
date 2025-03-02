import mongoose from "mongoose";

const photographSchema = new mongoose.Schema({
  image: String,
  caption: String,
});

const checklistItemSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["YES", "NO", "N/A"],
    required: true,
  },
  details: {
    type: String,
    default: "",
  },
});

const insulationReportSchema = new mongoose.Schema(
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

    // Checklist
    checklist: {
      verifyCertificateOfCompliance: checklistItemSchema,
      verifyInsulationInstalled: checklistItemSchema,
      verifyRValueVisible: checklistItemSchema,
    },

    // Inspection Observations/Remarks
    inspectionObservations: {
      type: String,
      required: true,
    },

    // Inspector's Signature
    inspectorSignature: {
      type: String,
      required: true,
    },

    // Attachments
    hasPhotographs: {
      type: Boolean,
      default: true,
    },
    photographs: [photographSchema],

    // Report Type (for dashboard filtering)
    reportType: {
      type: String,
      default: "INSULATION",
    },
  },
  {
    timestamps: true,
  }
);

const InsulationReport =
  mongoose.models.InsulationReport ||
  mongoose.model("InsulationReport", insulationReportSchema);

export default InsulationReport;
