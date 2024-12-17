import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // You should set this in .env

export async function POST(request) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    // Find user by username
    const user = await User.findOne({
      $or: [{ username }, { email: username }], // Allow login with either username or email
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token with 7 days expiration
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" } // Changed to 7 days
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Set HTTP-only cookie with the token
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
      },
      { status: 200 }
    );

    // Set secure cookie with token for 7 days
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error during login" }, { status: 500 });
  }
}
