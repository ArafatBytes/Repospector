import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import ResetToken from "@/models/ResetToken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

export async function POST(request) {
  try {
    await connectDB();

    const { email } = await request.json();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive a password reset link.",
        },
        { status: 200 }
      );
    }

    // Generate unique reset token
    const token = crypto.randomBytes(32).toString("hex");

    // Save reset token
    await ResetToken.create({
      userId: user._id,
      token: token,
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    try {
      // Get transporter
      const transporter = createTransporter();

      // Send email
      await transporter.sendMail({
        from: `"Repospector" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #834CFF;">Reset Your Password</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #834CFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,<br>Repospector Team</p>
          </div>
        `,
      });

      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive a password reset link.",
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      // Delete the token if email sending fails
      await ResetToken.deleteOne({ token });

      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Error processing password reset request" },
      { status: 500 }
    );
  }
}
