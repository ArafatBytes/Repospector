import mongoose from "mongoose";

const photographSchema = new mongoose.Schema({
  image: String,
  description: {
    type: String,
    required: true,
  },
});

const structuralReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic Info
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    issues: {
      type: [String],
      required: true,
    },
    // Photographs
    photographs: [photographSchema],
    // Report Type (for dashboard filtering)
    reportType: {
      type: String,
      default: "STRUCTURAL",
    },
  },
  {
    timestamps: true,
  }
);

const StructuralReport =
  mongoose.models.StructuralReport ||
  mongoose.model("StructuralReport", structuralReportSchema);

export default StructuralReport;
