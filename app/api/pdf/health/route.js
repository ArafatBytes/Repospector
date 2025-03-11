import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";

export async function GET() {
  try {
    // Check if chromium is available
    const executablePath = await chromium.executablePath();

    return NextResponse.json({
      status: "ok",
      message: "PDF generation service is healthy",
      chromium: {
        executablePath,
        version: chromium.version || "unknown",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "PDF generation service is not healthy",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
