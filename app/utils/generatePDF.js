import { toast } from "react-hot-toast";

/**
 * Convert an image to base64
 * @param {string} src - Image source URL
 * @returns {Promise<string>} Base64 encoded image
 */
async function convertImageToBase64(imgElement) {
  return new Promise(async (resolve) => {
    const src = imgElement.src;

    // If it's already a base64 image, return as is
    if (src.startsWith("data:")) {
      resolve(src);
      return;
    }

    try {
      // For the logo, use the absolute path from public directory
      const imgUrl = src.startsWith("/") ? window.location.origin + src : src;

      const response = await fetch(imgUrl);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => {
        console.error("Error converting image to base64:", reader.error);
        resolve(src); // Fallback to original source
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error fetching image:", error);
      resolve(src); // Fallback to original source
    }
  });
}

/**
 * Generates a PDF from an HTML element using server-side Puppeteer
 * @param {string} elementId - The ID of the HTML element to convert to PDF
 * @param {string} fileName - The name of the PDF file
 */
export async function generatePDF(elementId, fileName) {
  try {
    // Show loading toast
    toast.loading("Generating PDF...", { id: "pdf-generation" });

    // Get the HTML content of the element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    // Create a deep clone of the element to avoid modifying the original
    const clonedElement = element.cloneNode(true);

    // Convert all images to base64
    const images = clonedElement.getElementsByTagName("img");
    for (let img of images) {
      try {
        const base64Url = await convertImageToBase64(img);
        img.src = base64Url;
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }

    // Get all stylesheets from the document
    const styleSheets = Array.from(document.styleSheets);
    let styles = "";

    // Process each stylesheet
    styleSheets.forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        rules.forEach((rule) => {
          styles += rule.cssText + "\n";
        });
      } catch (e) {
        if (sheet.href) {
          styles += `@import url("${sheet.href}");\n`;
        }
      }
    });

    // Create a complete HTML document with all styles
    const completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            ${styles}
            /* Additional print-specific styles */
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                forced-color-adjust: none !important;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .logo-image {
                width: 300px !important;
                height: auto !important;
                display: block !important;
                object-fit: contain !important;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
              }
              .bg-\\[\\#4A90E2\\], h3.bg-\\[\\#4A90E2\\], #inspection-report h3 {
                background-color: #4a90e2 !important;
                color: white !important;
              }
              .print-break-before {
                break-before: page !important;
              }
              .print-break-after {
                break-after: page !important;
              }
              .print-break-inside-avoid {
                break-inside: avoid !important;
              }
              .photos-section {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
              .photo-container {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
          ${clonedElement.outerHTML}
        </body>
      </html>
    `;

    // Call the API endpoint
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: completeHtml,
        fileName,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    // Get the PDF blob
    const blob = await response.blob();

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success toast
    toast.success("PDF generated successfully!", { id: "pdf-generation" });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF", { id: "pdf-generation" });
  }
}
