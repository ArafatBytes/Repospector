import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import GarageReport from "@/models/GarageReport";
import Info from "@/models/Info";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request, { params }) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    await connectDB();
    const report = await GarageReport.findById(params.id);

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    // Check if user has access to this report
    if (
      report.userId.toString() !== decoded.userId &&
      decoded.role !== "admin"
    ) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error in GET /api/garage/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    await connectDB();
    const data = await request.json();
    const report = await GarageReport.findById(params.id);

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    // Check if user has access to this report
    if (
      report.userId.toString() !== decoded.userId &&
      decoded.role !== "admin"
    ) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updatedReport = await GarageReport.findByIdAndUpdate(
      params.id,
      { ...data },
      { new: true }
    );

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Error in PUT /api/garage/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    await connectDB();
    const report = await GarageReport.findById(params.id);

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    // Check if user has access to this report
    if (
      report.userId.toString() !== decoded.userId &&
      decoded.role !== "admin"
    ) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await GarageReport.findByIdAndDelete(params.id);

    // Decrement the total inspections count in Info model
    await Info.findOneAndUpdate(
      { userId: report.userId },
      { $inc: { totalInspections: -1 } }
    );

    return new NextResponse("Report deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/garage/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
