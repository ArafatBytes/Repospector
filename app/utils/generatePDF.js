import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

export async function generateInspectionPDF(inspectionId, projectName) {
  const loadingToast = toast.loading("Preparing PDF for download...");

  try {
    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.visibility = "hidden";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "1280px"; // Set a fixed width for consistent rendering
    iframe.style.height = "1024px"; // Set a fixed height
    document.body.appendChild(iframe);

    // Load the inspection view page in the iframe
    iframe.src = `/inspection/${inspectionId}`;

    // Wait for the page to load
    await new Promise((resolve) => {
      iframe.onload = () => {
        setTimeout(resolve, 1500); // Give extra time for images and styles to load
      };
    });

    // Get the main content div from the iframe
    const content = iframe.contentDocument.querySelector(".max-w-4xl");

    if (!content) {
      throw new Error("Content element not found");
    }

    // Hide the "Back to Dashboard" link
    const backLink = content.querySelector('a[href="/dashboard"]');
    if (backLink) {
      backLink.style.display = "none";
    }

    // Update loading message
    toast.loading("Generating PDF...", { id: loadingToast });

    // Create canvas from the content
    const canvas = await html2canvas(content, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      windowWidth: content.scrollWidth,
      windowHeight: content.scrollHeight,
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF("p", "mm");
    let position = 0;

    // Add image to first page
    pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const fileName = `${projectName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_inspection.pdf`;
    pdf.save(fileName);

    // Show success message
    toast.success("PDF downloaded successfully", { id: loadingToast });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF", { id: loadingToast });
  } finally {
    // Clean up the iframe
    const iframe = document.querySelector("iframe");
    if (iframe) {
      document.body.removeChild(iframe);
    }
  }
}
