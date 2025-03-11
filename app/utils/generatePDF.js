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
      toast.error("Report ID is required", { id: loadingToast });
      throw new Error("Report ID is required");
    }

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
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate PDF";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        toast.error(errorMessage, { id: loadingToast });
        throw new Error(errorMessage);
      }

      // Get the PDF blob from the response
      const pdfBlob = await response.blob();

      // Check if the blob is valid
      if (!pdfBlob || pdfBlob.size === 0) {
        toast.error("Generated PDF is empty", { id: loadingToast });
        throw new Error("Generated PDF is empty");
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
      console.error("Error in PDF generation process:", error);
      toast.error(error.message || "Failed to generate PDF", {
        id: loadingToast,
      });
      throw error;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Toast is already shown in the inner catch block
  }
}
