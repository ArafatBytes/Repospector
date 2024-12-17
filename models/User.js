import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"], // restricting possible roles
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Check if the model is already defined to prevent overwriting
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
