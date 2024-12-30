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

    // Launch browser with specific configuration for Vercel
    browser = await chromium.launch({
      headless: true,
      args: [
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-zygote",
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 1024 },
      deviceScaleFactor: 1,
    });

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
    console.log("Navigating to:", url);

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    console.log("Waiting for content selector");
    // Wait for content
    await page.waitForSelector(".max-w-4xl", {
      timeout: 30000,
      state: "visible",
    });

    console.log("Generating PDF");
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
      timeout: 30000,
    });

    console.log("PDF generated successfully");

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
      url: `${protocol}://${host}/inspection/${params.id}`,
    });

    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: error.message,
        url: `${protocol}://${host}/inspection/${params.id}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
