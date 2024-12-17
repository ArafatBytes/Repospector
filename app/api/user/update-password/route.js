import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function PUT(request) {
  try {
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    await connectDB();

    const { currentPassword, newPassword } = await request.json();

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(decoded.userId, {
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Error updating password" },
      { status: 500 }
    );
  }
}
