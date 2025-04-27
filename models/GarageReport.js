import mongoose from "mongoose";

const photographSchema = new mongoose.Schema(
  {
    file: String,
    description: String,
  },
  { _id: false }
);

const remarkSchema = new mongoose.Schema(
  {
    id: Number,
    text: String,
  },
  { _id: false }
);

const garageReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    attnName: String,
    attnCompany: String,
    attnAddress: String,
    attnEmail: String,
    re: String,
    applicationBody: String,
    buildingAddress: String,
    blockNo: String,
    lotNo: String,
    bin: String,
    landmarkStatus: String,
    communityBoard: String,
    numberOfStories: String,
    lotSize: String,
    grossFloorArea: String,
    usage: String,
    zoning: String,
    zoningMapNo: String,
    yearBuilt: String,
    construction: String,
    locationMap: String,
    parkingOverlayImages: [String],
    reportStructureAnswers: [String],
    photographs: [photographSchema],
    remarks: [remarkSchema],
  },
  {
    timestamps: true,
  }
);

const GarageReport =
  mongoose.models.GarageReport ||
  mongoose.model("GarageReport", garageReportSchema);

export default GarageReport;
