import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import ConcreteReport from "@/models/ConcreteReport";
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

    // Fetch the report
    let report;
    if (decoded.role === "admin") {
      // Admin can view any report
      report = await ConcreteReport.findById(id);
    } else {
      // Regular users can only view their own reports
      report = await ConcreteReport.findOne({
        _id: id,
        userId,
      });
    }

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching concrete report:", error);
    return NextResponse.json(
      { error: "Failed to fetch concrete report" },
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

    // Update the report
    let report;
    if (decoded.role === "admin") {
      // Admin can update any report
      report = await ConcreteReport.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
    } else {
      // Regular users can only update their own reports
      report = await ConcreteReport.findOneAndUpdate(
        { _id: id, userId },
        updatedData,
        { new: true }
      );
    }

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error updating concrete report:", error);
    return NextResponse.json(
      { error: "Failed to update concrete report" },
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

    // Delete the report
    let report;
    if (decoded.role === "admin") {
      // Admin can delete any report
      report = await ConcreteReport.findByIdAndDelete(id);
      if (report) {
        // Decrement the total inspections count in Info model for the report's owner
        await Info.findOneAndUpdate(
          { userId: report.userId },
          { $inc: { totalInspections: -1 } }
        );
      }
    } else {
      // Regular users can only delete their own reports
      report = await ConcreteReport.findOneAndDelete({
        _id: id,
        userId,
      });
      if (report) {
        // Decrement the total inspections count in Info model
        await Info.findOneAndUpdate(
          { userId },
          { $inc: { totalInspections: -1 } }
        );
      }
    }

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting concrete report:", error);
    return NextResponse.json(
      { error: "Failed to delete concrete report" },
      { status: 500 }
    );
  }
}
