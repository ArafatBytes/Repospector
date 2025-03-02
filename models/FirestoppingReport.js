import mongoose from "mongoose";

const photographSchema = new mongoose.Schema({
  image: String,
  caption: String,
});

const checklistSchema = new mongoose.Schema({
  firestoppingMaterialApproved: {
    status: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      required: true,
    },
    details: String,
  },
  penetrationsProperlySealed: {
    status: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      required: true,
    },
    details: String,
  },
});

const firestoppingReportSchema = new mongoose.Schema(
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
    dobJobNumber: {
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
      type: checklistSchema,
      required: true,
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
      default: "FIRESTOPPING",
    },
  },
  {
    timestamps: true,
  }
);

const FirestoppingReport =
  mongoose.models.FirestoppingReport ||
  mongoose.model("FirestoppingReport", firestoppingReportSchema);

export default FirestoppingReport;
