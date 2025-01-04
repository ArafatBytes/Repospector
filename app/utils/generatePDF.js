export function generateInspectionPDF(inspectionId) {
  // Store the current URL to return to
  const returnUrl = window.location.href;

  // Open inspection view in a new window
  const printWindow = window.open(`/inspection/${inspectionId}`, "_blank");

  // Wait for the page to fully load
  printWindow.addEventListener("load", function () {
    // Add a small delay to ensure all content is rendered
    setTimeout(() => {
      // Trigger print
      printWindow.print();

      // Add event listener to the print window's document
      printWindow.document.addEventListener(
        "mouseover",
        function closeWindow() {
          printWindow.document.removeEventListener("mouseover", closeWindow);
          printWindow.close();
          window.location.href = returnUrl;
        }
      );

      // Fallback for when print dialog is cancelled
      const checkPrintDialog = setInterval(() => {
        try {
          if (!printWindow || printWindow.closed) {
            clearInterval(checkPrintDialog);
            window.location.href = returnUrl;
          }
        } catch (e) {
          clearInterval(checkPrintDialog);
          window.location.href = returnUrl;
        }
      }, 500);
    }, 1000);
  });
}
