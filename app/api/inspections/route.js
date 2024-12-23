import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
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

    // Create new inspection document
    const inspection = await Inspection.create({
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
      message: "Inspection report submitted successfully",
      inspection,
    });
  } catch (error) {
    console.error("Error submitting inspection:", error);
    return NextResponse.json(
      { error: "Error submitting inspection report" },
      { status: 500 }
    );
  }
}
