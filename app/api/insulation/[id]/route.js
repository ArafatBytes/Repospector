import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import InsulationReport from "@/models/InsulationReport";
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

export async function GET(req, { params }) {
  try {
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

    await connectDB();

    // Fetch report
    const report = await InsulationReport.findOne({
      _id: params.id,
      userId,
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching insulation report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
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

    await connectDB();

    const data = await req.json();

    // Update report
    const report = await InsulationReport.findOneAndUpdate(
      {
        _id: params.id,
        userId,
      },
      data,
      { new: true }
    );

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error updating insulation report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
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

    await connectDB();

    // Delete report
    let report;
    if (decoded.role === "admin") {
      // Admin can delete any report
      report = await InsulationReport.findByIdAndDelete(params.id);
      if (report) {
        // Decrement the total inspections count in Info model for the report's owner
        await Info.findOneAndUpdate(
          { userId: report.userId },
          { $inc: { totalInspections: -1 } }
        );
      }
    } else {
      // Regular users can only delete their own reports
      report = await InsulationReport.findOneAndDelete({
        _id: params.id,
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
    console.error("Error deleting insulation report:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
