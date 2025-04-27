import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";

// Only import puppeteer (not puppeteer-core) for local
let localPuppeteer = null;
if (process.env.NODE_ENV !== "production") {
  localPuppeteer = require("puppeteer");
}

export async function POST(request) {
  try {
    const { html, fileName } = await request.json();

    let browser;
    if (process.env.NODE_ENV === "production") {
      // Production (Render, Vercel, etc)
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Local development
      browser = await localPuppeteer.launch({
        headless: true,
      });
    }

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
