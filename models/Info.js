import mongoose from "mongoose";

const infoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    totalInspections: {
      type: Number,
      default: 0,
    },
    experience: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Info = mongoose.models.Info || mongoose.model("Info", infoSchema);

export default Info;
