import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { html, fileName } = await request.json();

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
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
        top: "120px", // Increased top margin to accommodate header
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      preferCSSPageSize: true,
      scale: 1,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 10px 20px;
          font-size: 12px;
        ">
          <div>
            <img src="/images/logo.jpg" style="width: 300px; height: auto;" />
          </div>
          <div style="text-align: right;">
            <p>15 WEST 38TH STREET, 8TH FLOOR (SUITE 808)</p>
            <p>NEW YORK, NEW YORK 10018</p>
            <p>T: (212) 632-8430</p>
          </div>
        </div>
      `,
      footerTemplate:
        '<div style="width: 100%; text-align: center; font-size: 10px; padding: 10px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
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
