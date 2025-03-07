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
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate PDF");
    }

    // Get the PDF blob from the response
    const pdfBlob = await response.blob();

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
    console.error("Error generating PDF:", error);
    toast.error(error.message || "Failed to generate PDF");
  }
}
