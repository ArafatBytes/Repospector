import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Info from "@/models/Info";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper function to verify token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

export async function GET(req) {
  await connectDB();

  try {
    // Extract ID from the URL
    const id = req.url.split("/").pop();

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = await verifyToken(token);
    const userId = decoded.userId;

    // Fetch the inspection
    let inspection;
    if (decoded.role === "admin") {
      // Admin can view any inspection
      inspection = await Inspection.findById(id);
    } else {
      // Regular users can only view their own inspections
      inspection = await Inspection.findOne({
        _id: id,
        userId,
      });
    }

    if (!inspection) {
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(inspection);
  } catch (error) {
    console.error("Error fetching inspection:", error);
    return NextResponse.json(
      { error: "Failed to fetch inspection" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await connectDB();

  try {
    // Extract ID from the URL
    const id = req.url.split("/").pop();

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = await verifyToken(token);
    const userId = decoded.userId;

    // Get updated data from request body
    const updatedData = await req.json();

    // Update the inspection
    let inspection;
    if (decoded.role === "admin") {
      // Admin can update any inspection
      inspection = await Inspection.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
    } else {
      // Regular users can only update their own inspections
      inspection = await Inspection.findOneAndUpdate(
        { _id: id, userId },
        updatedData,
        { new: true }
      );
    }

    if (!inspection) {
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(inspection);
  } catch (error) {
    console.error("Error updating inspection:", error);
    return NextResponse.json(
      { error: "Failed to update inspection" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB();

  try {
    // Extract ID from the URL
    const id = req.url.split("/").pop();

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = await verifyToken(token);
    const userId = decoded.userId;

    // Delete the inspection
    let inspection;
    if (decoded.role === "admin") {
      // Admin can delete any inspection
      inspection = await Inspection.findByIdAndDelete(id);
      if (inspection) {
        // Decrement the total inspections count in Info model for the inspection's owner
        await Info.findOneAndUpdate(
          { userId: inspection.userId },
          { $inc: { totalInspections: -1 } }
        );
      }
    } else {
      // Regular users can only delete their own inspections
      inspection = await Inspection.findOneAndDelete({
        _id: id,
        userId,
      });
      if (inspection) {
        // Decrement the total inspections count in Info model
        await Info.findOneAndUpdate(
          { userId },
          { $inc: { totalInspections: -1 } }
        );
      }
    }

    if (!inspection) {
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Inspection deleted successfully" });
  } catch (error) {
    console.error("Error deleting inspection:", error);
    return NextResponse.json(
      { error: "Failed to delete inspection" },
      { status: 500 }
    );
  }
}
