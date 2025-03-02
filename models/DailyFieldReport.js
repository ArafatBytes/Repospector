import mongoose from "mongoose";

const photographSchema = new mongoose.Schema({
  image: String,
  caption: String,
});

const dailyFieldReportSchema = new mongoose.Schema(
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

    // Contractor Information
    contractor: {
      name: {
        type: String,
        required: true,
      },
      dobContractorId: {
        type: String,
        required: true,
      },
    },

    // Daily Activities
    laborAndEquipment: {
      type: String,
      default: "",
    },
    activitiesForDay: {
      type: String,
      required: true,
    },
    plannedActivitiesForTomorrow: {
      type: String,
      default: "",
    },

    // Signature
    signatureOfProfessionalEngineer: {
      type: String,
      required: true,
    },

    // Attachments
    hasPhotographs: {
      type: Boolean,
      default: false,
    },

    // Photographs
    photographs: [photographSchema],

    // Report Type (for dashboard filtering)
    reportType: {
      type: String,
      default: "DAILY_FIELD",
    },
  },
  {
    timestamps: true,
  }
);

const DailyFieldReport =
  mongoose.models.DailyFieldReport ||
  mongoose.model("DailyFieldReport", dailyFieldReportSchema);

export default DailyFieldReport;
