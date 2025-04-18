import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { html, fileName } = await request.json();

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set viewport to A4 size
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      deviceScaleFactor: 2, // Increase resolution
    });

    // Set the content
    await page.setContent(html, {
      waitUntil: ["networkidle0", "load", "domcontentloaded"],
    });

    // Wait for fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // Wait for images to load
    await page.evaluate(async () => {
      const selectors = Array.from(document.getElementsByTagName("img"));
      await Promise.all(
        selectors.map((img) => {
          if (img.complete) return;
          return new Promise((resolve, reject) => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", reject);
          });
        })
      );
    });

    // Generate PDF with better quality settings
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      preferCSSPageSize: true,
      scale: 1,
    });

    // Close the browser
    await browser.close();

    // Return the PDF as a response
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
