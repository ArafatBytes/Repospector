import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Info from "@/models/Info";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// GET user data
export async function GET(request) {
  try {
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    await connectDB();

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let info = await Info.findOne({ userId: decoded.userId });
    if (!info) {
      info = await Info.create({ userId: decoded.userId });
    }

    return NextResponse.json({
      ...user.toObject(),
      bio: info.bio,
      totalInspections: info.totalInspections,
      experience: info.experience,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}

// PUT update user data
export async function PUT(request) {
  try {
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    await connectDB();

    const data = await request.json();

    // Check if username is already taken (if username is being updated)
    if (data.username) {
      const existingUser = await User.findOne({
        username: data.username,
        _id: { $ne: decoded.userId }, // exclude current user
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    // Update user data
    await User.findByIdAndUpdate(decoded.userId, {
      name: data.name,
      username: data.username,
      avatar: data.avatar,
    });

    // Update info data (excluding totalInspections)
    await Info.findOneAndUpdate(
      { userId: decoded.userId },
      {
        bio: data.bio,
        experience: data.experience,
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { error: "Error updating user data" },
      { status: 500 }
    );
  }
}
