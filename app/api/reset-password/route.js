import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import ResetToken from "@/models/ResetToken";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const { token, newPassword } = await request.json();

    // Find valid token
    const resetToken = await ResetToken.findOne({ token });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(resetToken.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete used token
    await ResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Error resetting password" },
      { status: 500 }
    );
  }
}
