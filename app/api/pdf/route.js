import { NextResponse } from "next/server";
import { chromium } from "playwright-core";
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
      browser = await chromium.launch({
        headless: true,
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
      // Create a new browser context
      const context = await browser.newContext();

      // Add the authentication cookie
      await context.addCookies([
        {
          name: "token",
          value: token.value,
          domain: new URL(baseUrl).hostname,
          path: "/",
        },
      ]);

      // Create a new page
      const page = await context.newPage();

      // Set viewport size
      await page.setViewportSize({
        width: 1200,
        height: 1600,
      });

      // Navigate to the report page
      console.log(`Navigating to ${reportUrl} for ${reportType} report...`);
      await page.goto(reportUrl, { waitUntil: "networkidle" });

      // Wait for the content to be fully loaded - different reports may have different selectors
      try {
        // Try the most common selector first
        console.log("Waiting for .max-w-4xl selector...");
        await page.waitForSelector(".max-w-4xl", { timeout: 5000 });
      } catch (error) {
        console.log("First selector not found, trying alternative...");
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

      // Special handling for Special Inspection Report images
      if (reportType === "SPECIAL_INSPECTION") {
        await page.evaluate(() => {
          // Find all images in the report
          const images = document.querySelectorAll(
            'img:not([src^="/images/logo"])'
          );

          // Adjust each image
          images.forEach((img) => {
            // Set max dimensions
            img.style.maxWidth = "90%";
            img.style.maxHeight = "250px";
            img.style.height = "auto";
            img.style.objectFit = "contain";
            img.style.margin = "0 auto";

            // Remove any fixed width/height attributes
            img.removeAttribute("width");
            img.removeAttribute("height");
          });

          // Find the "Comments and additional information, including photographs" section
          const commentsSection = Array.from(
            document.querySelectorAll("h2, .text-lg")
          ).find((el) =>
            el.textContent.includes("Comments and additional information")
          );

          if (commentsSection) {
            // Find the parent container of the section
            let sectionContainer =
              commentsSection.closest(".mb-8") ||
              commentsSection.closest(".border");

            if (sectionContainer) {
              // Find all images in this section
              const sectionImages = sectionContainer.querySelectorAll("img");

              sectionImages.forEach((img) => {
                // Apply more specific styling to these images
                img.style.maxWidth = "85%";
                img.style.maxHeight = "180px";
                img.style.objectFit = "contain";
                img.style.margin = "0 auto";
                img.style.display = "block";
              });

              // Find image grid containers
              const gridContainers = sectionContainer.querySelectorAll(
                ".grid, .grid-cols-1, .grid-cols-2, .grid-cols-3"
              );

              gridContainers.forEach((grid) => {
                grid.style.display = "grid";
                grid.style.gridGap = "10px";
                grid.style.marginBottom = "15px";

                // Find all divs directly inside the grid (image containers)
                const cells = grid.querySelectorAll(":scope > div");
                cells.forEach((cell) => {
                  cell.style.height = "auto";
                  cell.style.overflow = "hidden";
                  cell.style.display = "flex";
                  cell.style.justifyContent = "center";
                  cell.style.alignItems = "center";
                });
              });
            }
          }
        });
      }

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
          ${
            reportType === "SPECIAL_INSPECTION"
              ? `
          /* Special styles only for Special Inspection Report */
          img {
            max-width: 90% !important;
            max-height: 250px !important;
            height: auto !important;
            object-fit: contain !important;
            margin: 0 auto !important;
          }
          
          /* Target the image grid in the Special Inspection Report */
          .grid-cols-1 img, .grid-cols-2 img, .grid-cols-3 img {
            width: auto !important;
            max-height: 200px !important;
            object-fit: contain !important;
            display: block !important;
            margin: 0 auto !important;
          }
          
          /* Ensure image containers don't overflow */
          .grid, .grid-cols-1, .grid-cols-2, .grid-cols-3 {
            display: grid !important;
            grid-gap: 10px !important;
          }
          
          /* Ensure image containers have proper height */
          .grid > div, .grid-cols-1 > div, .grid-cols-2 > div, .grid-cols-3 > div {
            height: auto !important;
            overflow: hidden !important;
          }
          `
              : ""
          }
        `,
      });

      // Determine if the report should be in landscape orientation
      const landscapeReports = ["AIR_BALANCING", "DAILY_FIELD"];
      const isLandscape = landscapeReports.includes(reportType);

      // Special PDF settings for Special Inspection Reports
      const pdfSettings = {
        format: "A4",
        landscape: isLandscape,
        printBackground: true,
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "20mm",
          left: "10mm",
        },
        displayHeaderFooter: true,
        headerTemplate: " ",
        footerTemplate: `
          <div style="width: 100%; font-size: 10px; text-align: center; color: #666; padding: 0 10mm;">
            <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            <div style="margin-top: 5px;">Generated on ${new Date().toLocaleDateString()}</div>
          </div>
        `,
      };

      // Adjust settings for Special Inspection Reports
      if (reportType === "SPECIAL_INSPECTION") {
        pdfSettings.scale = 0.95; // Slightly scale down content
        pdfSettings.margin = {
          top: "15mm",
          right: "15mm",
          bottom: "20mm",
          left: "15mm",
        };
      }

      // Generate PDF
      console.log(`Generating PDF for ${reportType} report...`);
      const pdfBuffer = await page.pdf(pdfSettings);

      // Verify PDF buffer
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error("PDF generation failed: Empty buffer received");
      }

      console.log(
        `PDF generated successfully using Playwright for ${reportType} report with ID: ${reportId} (${pdfBuffer.length} bytes)`
      );

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
