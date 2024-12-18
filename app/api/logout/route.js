import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response object
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Error during logout" }, { status: 500 });
  }
}
