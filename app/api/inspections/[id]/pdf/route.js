import puppeteer from "puppeteer";
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

    // Launch browser with specific configuration for Vercel
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
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
      timeout: 30000, // Increase timeout to 30 seconds
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
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
