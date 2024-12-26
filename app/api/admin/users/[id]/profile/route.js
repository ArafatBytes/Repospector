import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Info from "@/models/Info";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request, { params }) {
  try {
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and check if user is admin
    const decoded = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    // Get the ID from params
    const { id } = await params;

    // Get user data
    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user info
    const info = await Info.findOne({ userId: id });

    // Combine user and info data
    const userData = {
      ...user.toObject(),
      bio: info?.bio || "",
      experience: info?.experience || "",
      totalInspections: info?.totalInspections || 0,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Error fetching user profile" },
      { status: 500 }
    );
  }
}
