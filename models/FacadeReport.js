import mongoose from "mongoose";

const observationSchema = new mongoose.Schema({
  id: Number,
  text: String,
});

const imageSchema = new mongoose.Schema({
  id: Number,
  file: String, // Base64 encoded image
  description: String,
});

const facadeReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Project Details
    projectName: {
      type: String,
    },
    projectAddress: {
      type: String,
    },
    client: {
      type: String,
    },
    date: {
      type: Date,
    },
    siteInspector: {
      type: String,
    },
    inspectorImage: {
      type: String, // Base64 encoded image
    },

    // Building Details - Property Information
    buildingAddress: {
      type: String,
    },
    blockNo: {
      type: String,
    },
    lotNo: {
      type: String,
    },
    bin: {
      type: String,
    },
    landmarkStatus: {
      type: String,
    },
    communityBoard: {
      type: String,
    },

    // Building Details - Building Description
    numberOfStories: {
      type: String,
    },
    lotSize: {
      type: String,
    },
    grossFloorArea: {
      type: String,
    },
    usage: {
      type: String,
    },
    zoning: {
      type: String,
    },
    zoningMapNo: {
      type: String,
    },
    yearBuilt: {
      type: String,
    },
    construction: {
      type: String,
    },

    // Observations
    observations: [observationSchema],

    // Images
    images: [
      {
        id: Number,
        file: String,
        description: String,
      },
    ],
    structuralDesignImages: [
      {
        id: Number,
        file: String,
        description: String,
      },
    ],

    // Report Type (for dashboard filtering)
    reportType: {
      type: String,
      default: "FACADE",
    },
  },
  {
    timestamps: true,
  }
);

const FacadeReport =
  mongoose.models.FacadeReport ||
  mongoose.model("FacadeReport", facadeReportSchema);

export default FacadeReport;
