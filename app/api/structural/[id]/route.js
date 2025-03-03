import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import StructuralReport from "@/models/StructuralReport";
import Info from "@/models/Info";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(request, context) {
  try {
    const id = context.params.id;
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const report = await StructuralReport.findById(id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check if user has permission to access this report
    if (
      decoded.role !== "admin" &&
      report.userId.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching structural report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const id = context.params.id;
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const report = await StructuralReport.findById(id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check if user has permission to edit this report
    if (
      decoded.role !== "admin" &&
      report.userId.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updatedReport = await StructuralReport.findByIdAndUpdate(id, body, {
      new: true,
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Error updating structural report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const id = context.params.id;
    const token = request.cookies.get("token")?.value;
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const report = await StructuralReport.findById(id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check if user has permission to delete this report
    if (
      decoded.role !== "admin" &&
      report.userId.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await StructuralReport.findByIdAndDelete(id);

    // Decrement the total inspections count for the user
    await Info.findOneAndUpdate(
      { userId: report.userId },
      { $inc: { totalInspections: -1 } }
    );

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting structural report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
