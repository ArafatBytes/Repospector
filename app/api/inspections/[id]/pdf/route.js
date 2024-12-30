import chrome from "@chrome-aws-lambda";
import puppeteer from "puppeteer-core";
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
    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath:
        process.env.NODE_ENV === "development"
          ? "/usr/bin/chromium-browser" // Local Chrome path
          : await chrome.executablePath, // Lambda Chrome path
      headless: true,
      defaultViewport: {
        width: 1280,
        height: 1024,
        deviceScaleFactor: 1,
      },
    });

    const page = await browser.newPage();

    // Set cookie
    await page.setCookie({
      name: "token",
      value: authCookie.value,
      domain: host,
      path: "/",
    });

    // Navigate to page
    const url = `${protocol}://${host}/inspection/${id}`;
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for content
    await page.waitForSelector(".max-w-4xl", {
      timeout: 30000,
      visible: true,
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
