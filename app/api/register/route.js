import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, username, password, avatar } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      avatar,
      // role will default to 'user' as defined in the schema
    });

    // Create JWT token with 7 days expiration
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error registering user" },
      { status: 500 }
    );
  }
}
