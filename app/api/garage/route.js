import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import GarageReport from "@/models/GarageReport";
import Info from "@/models/Info";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
  try {
    // Verify user is authenticated
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode token to get userId
    const decoded = jwt.verify(token.value, JWT_SECRET);
    const userId = decoded.userId;

    // Connect to database
    await connectDB();

    // Get form data from request
    const formData = await request.json();

    // Create new garage report document
    const report = await GarageReport.create({
      ...formData,
      userId,
    });

    // Update user's total inspections count in Info model
    await Info.findOneAndUpdate(
      { userId },
      { $inc: { totalInspections: 1 } },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Garage Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Error submitting garage report:", error);
    return NextResponse.json(
      { error: "Error submitting garage report" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Get userId from query params if it exists
    const url = new URL(request.url);
    const queryUserId = url.searchParams.get("userId");

    // If queryUserId exists, verify that the current user is an admin
    if (queryUserId && decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch reports for the specified user or the current user
    const reports = await GarageReport.find({
      userId: queryUserId || userId,
    })
      .sort({ createdAt: -1 })
      .select("projectName projectAddress client date reportType");

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching garage reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch garage reports" },
      { status: 500 }
    );
  }
}
