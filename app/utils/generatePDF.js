import { toast } from "react-hot-toast";

export async function generateInspectionPDF(
  inspectionId,
  projectName,
  reportType = "SPECIAL_INSPECTION"
) {
  try {
    // Show loading toast
    const loadingToast = toast.loading("Generating PDF...");

    // Ensure inspectionId and reportType are valid
    if (!inspectionId) {
      throw new Error("Report ID is required");
    }

    // Set up a timeout for the API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      // Call our API endpoint to generate the PDF
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: inspectionId,
          reportType: reportType || "SPECIAL_INSPECTION",
        }),
        signal: controller.signal,
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = "Failed to generate PDF";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Failed to generate PDF: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Get the PDF blob from the response
      const pdfBlob = await response.blob();

      // Check if the blob is actually a PDF
      if (pdfBlob.type !== "application/pdf") {
        // Try to get the error message from the response
        const text = await pdfBlob.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || "Invalid PDF response");
        } catch (e) {
          throw new Error("Server returned an invalid response");
        }
      }

      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a filename with fallback for undefined projectName
      const safeProjectName = (projectName || "report")
        .toString()
        .replace(/[^a-z0-9_-]/gi, "_");
      const fileName = `${(
        reportType || "report"
      ).toLowerCase()}_${safeProjectName}.pdf`;

      // Create a temporary link element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = fileName;

      // Append to the document, click it, and remove it
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);

      // Show success toast
      toast.success("PDF downloaded successfully", { id: loadingToast });
    } catch (error) {
      // Clear the timeout if there was an error
      clearTimeout(timeoutId);

      // Handle AbortError specifically
      if (error.name === "AbortError") {
        throw new Error("PDF generation timed out. Please try again.");
      }

      throw error;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error(error.message || "Failed to generate PDF");
  }
}
