import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Inspection from "@/models/Inspection";
import Info from "@/models/Info";
import { subDays } from "date-fns";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request) {
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

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total inspections count
    const totalInspections = await Inspection.countDocuments();

    // Get recent inspections (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentInspections = await Inspection.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get recent users with their info and inspection counts
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user info and inspection counts
    const userDetails = await Promise.all(
      recentUsers.map(async (user) => {
        // Get user info
        const info = await Info.findOne({ userId: user._id });

        // Get inspection count
        const inspectionCount = await Inspection.countDocuments({
          userId: user._id,
        });

        return {
          ...user.toObject(),
          bio: info?.bio || "",
          totalInspections: inspectionCount,
        };
      })
    );

    // Get recent inspections (last 10)
    const recentInspectionsList = await Inspection.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email");

    return NextResponse.json({
      stats: {
        totalUsers,
        totalInspections,
        recentInspections,
      },
      recentUsers: userDetails,
      recentInspectionsList,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Error fetching admin statistics" },
      { status: 500 }
    );
  }
}
