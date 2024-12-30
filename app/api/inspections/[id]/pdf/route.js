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

    // Launch browser
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
    await page.goto(url, { waitUntil: "networkidle0" });

    // Wait for the content to be loaded
    await page.waitForSelector(".max-w-4xl", { timeout: 5000 });

    // Hide the "Back to Dashboard" link
    await page.evaluate(() => {
      const backLink = document.querySelector('a[href="/dashboard"]');
      if (backLink) {
        backLink.style.display = "none";
      }
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

    await browser.close();

    // Set response headers
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/pdf");
    responseHeaders.set(
      "Content-Disposition",
      "attachment; filename=inspection.pdf"
    );

    return new Response(pdf, {
      headers: responseHeaders,
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
