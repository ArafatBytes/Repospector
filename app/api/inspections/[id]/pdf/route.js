import { chromium } from "playwright-core";
import { headers } from "next/headers";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  let browser = null;

  try {
    // Get the headers and params
    const headersList = await headers();
    const cookieStore = cookies();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const { id } = await params;

    // Get authentication cookie
    const authCookie = cookieStore.get("token");
    if (!authCookie) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Launch browser
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Set cookie
    await context.addCookies([
      {
        name: "token",
        value: authCookie.value,
        domain: host,
        path: "/",
      },
    ]);

    // Navigate to page
    const url = `${protocol}://${host}/inspection/${id}`;
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Wait for content
    await page.waitForSelector(".max-w-4xl", {
      timeout: 30000,
      state: "visible",
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    // Close browser
    if (browser !== null) {
      await browser.close();
    }

    // Return PDF
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="inspection-${id}.pdf"`,
      },
    });
  } catch (error) {
    // Make sure to close browser on error
    if (browser !== null) {
      await browser.close();
    }

    console.error("PDF Generation Error:", {
      message: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
