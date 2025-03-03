import mongoose from "mongoose";

const photographSchema = new mongoose.Schema({
  image: String,
  description: {
    type: String,
    required: true,
  },
});

const inspectionItemSchema = new mongoose.Schema({
  notes: {
    type: String,
    required: true,
  },
});

const appurtenanceSchema = new mongoose.Schema({
  notes: {
    type: String,
    required: true,
  },
});

const parapetReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic Info
    address: {
      type: String,
      required: true,
    },
    inspectorName: {
      type: String,
      required: true,
    },
    inspectionDate: {
      type: Date,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerContactInfo: {
      type: String,
      required: true,
    },

    // Location Map
    locationMap: {
      type: String, // URL/Base64 of the uploaded image
      required: true,
    },

    // Parapet Construction Details
    parapetConstructionDetails: {
      material: {
        type: String,
        required: true,
      },
      height: {
        type: String,
        required: true,
      },
      thickness: {
        type: String,
        required: true,
      },
    },

    // Inspection Items
    inspectionItems: {
      parapetPlumb: inspectionItemSchema,
      displacement: inspectionItemSchema,
      cracks: inspectionItemSchema,
      missingLooseBricks: inspectionItemSchema,
      missingLooseCopingSegments: inspectionItemSchema,
      missingDeterioratedCopingCaulk: inspectionItemSchema,
      deterioratedMortarJoints: inspectionItemSchema,
      spalling: inspectionItemSchema,
      rot: inspectionItemSchema,
      looseDisturbedFlashing: inspectionItemSchema,
      signsOfWaterPenetration: inspectionItemSchema,
    },

    // Appurtenances
    appurtenances: {
      telecommunicationsEquipment: appurtenanceSchema,
      railings: appurtenanceSchema,
      roofAccessRails: appurtenanceSchema,
      gooseneckLadders: appurtenanceSchema,
      handrailAttachments: appurtenanceSchema,
      signs: appurtenanceSchema,
      cornicesAttached: appurtenanceSchema,
    },

    // Other
    other: {
      type: String,
    },

    // Photographs
    photographs: [photographSchema],

    // Report Type (for dashboard filtering)
    reportType: {
      type: String,
      default: "PARAPET",
    },
  },
  {
    timestamps: true,
  }
);

const ParapetReport =
  mongoose.models.ParapetReport ||
  mongoose.model("ParapetReport", parapetReportSchema);

export default ParapetReport;
