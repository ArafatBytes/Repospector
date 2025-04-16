import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema({
  floorNo: String,
  typeOfOutlet: String,
  sizeIn: String,
  areaFt: String,
  velFpm: String,
  actualCfm: String,
  reqCfm: String,
  remarks: String,
});

const photoSchema = new mongoose.Schema({
  image: String, // Base64 encoded image
  description: String,
});

const airBalancingReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic Info
    client: String,
    inspectionDate: Date,
    projectSiteAddress: String,
    projectId: String,
    inspectorName: String,
    timeInOut: String,
    reportNumber: String,
    siteWeather: String,

    // HVAC Unit Details
    unitNo: String,
    typeAndSize: String,
    manufacturer: String,
    directDrive: Boolean,
    vBeltDrive: Boolean,

    // Fan Details
    fanCfmRated: String,
    fanSpRated: String,
    fanRpmRated: String,
    fanAmpsRated: String,

    // Motor Details
    motorVolts: String,
    motorRpm: String,
    motorHp: String,

    // Duct System Details
    areaServed: String,
    instruments: String,
    supply: Boolean,
    return: Boolean,
    exhaust: Boolean,

    // Measurements
    measurements: [measurementSchema],

    // Photos
    photos: [photoSchema],

    // Report Type (for dashboard filtering)
    reportType: {
      type: String,
      default: "AIR_BALANCING",
    },
  },
  {
    timestamps: true,
  }
);

const AirBalancingReport =
  mongoose.models.AirBalancingReport ||
  mongoose.model("AirBalancingReport", airBalancingReportSchema);

export default AirBalancingReport;
