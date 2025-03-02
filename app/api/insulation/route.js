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

export async function GET(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token and get user info
    const decoded = await verifyToken(token);
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get("userId");

    await connectDB();

    let query = {};

    // If a specific userId is requested and user is admin, filter by that userId
    if (queryUserId && decoded.role === "admin") {
      query.userId = queryUserId;
    } else {
      // Regular users can only see their own reports
      query.userId = decoded.userId;
    }

    // Fetch reports
    const reports = await InsulationReport.find(query).sort({ createdAt: -1 });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching insulation reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
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

    // Create new report
    const newReport = await InsulationReport.create({
      ...data,
      userId,
    });

    // Increment total inspections count
    await Info.findOneAndUpdate({ userId }, { $inc: { totalInspections: 1 } });

    return NextResponse.json(newReport);
  } catch (error) {
    console.error("Error creating insulation report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
