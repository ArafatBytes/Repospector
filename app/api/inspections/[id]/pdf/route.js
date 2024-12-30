import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { headers } from "next/headers";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
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
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Configure browser
    const executablePath = await chromium.executablePath();

    // Launch browser with specific configuration for Vercel
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Set the authentication cookie
    await page.setCookie({
      name: "token",
      value: authCookie.value,
      domain: host,
      path: "/",
    });

    // Set viewport to ensure consistent rendering
    await page.setViewport({ width: 1280, height: 1024 });

    // Navigate to the inspection view page
    const url = `${protocol}://${host}/inspection/${id}`;
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for the content to be loaded
    await page.waitForSelector(".max-w-4xl", { timeout: 30000 });

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
    await browser.close();

    // Return PDF
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="inspection-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
