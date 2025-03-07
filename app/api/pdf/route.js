import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    // Authentication is handled by middleware.js

    // Get request body with proper error handling
    let reportId, reportType;
    try {
      const body = await request.json();
      reportId = body.reportId;
      reportType = body.reportType;
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate required parameters
    if (!reportId || typeof reportId !== "string") {
      return NextResponse.json(
        { error: "Valid Report ID is required" },
        { status: 400 }
      );
    }

    if (!reportType || typeof reportType !== "string") {
      reportType = "SPECIAL_INSPECTION"; // Default to special inspection if not provided
    }

    // Determine the URL based on report type
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    let reportUrl;

    switch (reportType) {
      case "SPECIAL_INSPECTION":
        reportUrl = `${baseUrl}/inspection/${reportId}`;
        break;
      case "AIR_BALANCING":
        reportUrl = `${baseUrl}/air-balancing/${reportId}`;
        break;
      case "CONCRETE":
        reportUrl = `${baseUrl}/concrete/${reportId}`;
        break;
      case "DAILY_FIELD":
        reportUrl = `${baseUrl}/daily-field/${reportId}`;
        break;
      case "FIRESTOPPING":
        reportUrl = `${baseUrl}/firestopping/${reportId}`;
        break;
      case "INSULATION":
        reportUrl = `${baseUrl}/insulation/${reportId}`;
        break;
      case "PARAPET":
        reportUrl = `${baseUrl}/parapet/${reportId}`;
        break;
      case "STRUCTURAL":
        reportUrl = `${baseUrl}/structural/${reportId}`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        );
    }

    // Get the token from the request cookies
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Launch browser with proper error handling
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } catch (error) {
      console.error("Error launching browser:", error);
      return NextResponse.json(
        { error: "Failed to initialize PDF generation" },
        { status: 500 }
      );
    }

    try {
      const page = await browser.newPage();

      // Set the cookie for authentication
      await page.setCookie({
        name: "token",
        value: token.value,
        domain: new URL(baseUrl).hostname,
        path: "/",
      });

      // Set viewport to a typical page size
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 1,
      });

      // Navigate to the report page
      await page.goto(reportUrl, { waitUntil: "networkidle0" });

      // Wait for the content to be fully loaded - different reports may have different selectors
      try {
        // Try the most common selector first
        await page.waitForSelector(".max-w-4xl", { timeout: 5000 });
      } catch (error) {
        // If that fails, wait for any content to load
        await page.waitForSelector(".min-h-screen", { timeout: 5000 });
      }

      // Hide elements that shouldn't be in the PDF
      await page.evaluate(() => {
        // Hide navigation elements, buttons, etc.
        const elementsToHide = document.querySelectorAll(
          'nav, button, a[href="/dashboard"], .no-print'
        );
        elementsToHide.forEach((el) => {
          if (el) el.style.display = "none";
        });
      });

      // Add custom styles for PDF
      await page.addStyleTag({
        content: `
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        `,
      });

      // Determine if the report should be in landscape orientation
      const landscapeReports = ["AIR_BALANCING", "DAILY_FIELD"];
      const isLandscape = landscapeReports.includes(reportType);

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        landscape: isLandscape,
        printBackground: false,
        margin: {
          top: "10mm",
          right: "0mm",
          bottom: "10mm",
          left: "0mm",
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        footerTemplate: ``,
      });

      // Close browser
      await browser.close();

      // Return PDF as response
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${reportType.toLowerCase()}_report_${reportId}.pdf"`,
        },
      });
    } catch (error) {
      // Make sure to close the browser in case of error
      if (browser) {
        await browser.close();
      }
      throw error;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
