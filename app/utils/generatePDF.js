import toast from "react-hot-toast";

export async function generateInspectionPDF(inspectionId, projectName) {
  const loadingToast = toast.loading("Generating PDF...");

  try {
    const response = await fetch(`/api/inspections/${inspectionId}/pdf`);

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    // Get the PDF blob from the response
    const pdfBlob = await response.blob();

    // Create a URL for the blob
    const url = window.URL.createObjectURL(pdfBlob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_inspection.pdf`;

    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    window.URL.revokeObjectURL(url);

    toast.success("PDF downloaded successfully", { id: loadingToast });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF", { id: loadingToast });
  }
}
