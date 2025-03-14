import printJS from "print-js";
import { toast } from "react-hot-toast";

/**
 * Print an HTML element as a PDF
 *
 * @param {string} elementId - The ID of the HTML element to print
 * @param {string} documentTitle - The title for the document
 */
export function printElementAsPDF(elementId, documentTitle) {
  try {
    // Show a toast to guide the user
    toast.success(
      "Print dialog will open. Select 'Save as PDF' option in the destination dropdown to download the PDF. Make sure 'Background graphics' is checked in the More settings section.",
      { duration: 7000 }
    );

    // Add a temporary style tag to force color printing
    const styleTag = document.createElement("style");
    styleTag.id = "force-color-print";
    styleTag.innerHTML = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          forced-color-adjust: none !important;
        }
        .bg-\\[\\#4A90E2\\], h3.bg-\\[\\#4A90E2\\], #inspection-report h3 {
          background-color: #4a90e2 !important;
          color: white !important;
        }
      }
    `;
    document.head.appendChild(styleTag);

    // Configure the print options for best PDF quality
    const printOptions = {
      documentTitle: documentTitle,
      printable: elementId,
      type: "html",
      header: null,
      footer: null,
      css: null,
      scanStyles: true,
      targetStyles: ["*"],
      honorMarginPadding: true,
      honorColor: true,
      showModal: true, // Show a modal to indicate printing is in progress
      modalMessage: "Preparing document...",
      onLoadingEnd: () => {
        // Remove the temporary style tag after printing
        const tempStyle = document.getElementById("force-color-print");
        if (tempStyle) {
          document.head.removeChild(tempStyle);
        }
      },
    };

    // Short delay to ensure the toast is seen before print dialog appears
    setTimeout(() => {
      // Execute the print command
      printJS(printOptions);
    }, 1500);

    return true;
  } catch (error) {
    console.error("Error printing element:", error);
    toast.error("Error preparing document: " + error.message);

    // Clean up in case of error
    const tempStyle = document.getElementById("force-color-print");
    if (tempStyle) {
      document.head.removeChild(tempStyle);
    }

    return false;
  }
}
