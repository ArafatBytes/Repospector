export function generateInspectionPDF(
  inspectionId,
  projectName,
  reportType = "SPECIAL_INSPECTION"
) {
  // Store the current URL to return to
  const returnUrl = window.location.href;

  // Open inspection view in a new window based on report type
  const viewUrl =
    reportType === "AIR_BALANCING"
      ? `/air-balancing/${inspectionId}`
      : reportType === "CONCRETE"
      ? `/concrete/${inspectionId}`
      : `/inspection/${inspectionId}`;
  const printWindow = window.open(viewUrl, "_blank");

  if (!printWindow) {
    console.error("Failed to open print window");
    return;
  }

  // Function to check if the page is fully loaded
  const checkPageLoaded = () => {
    if (
      printWindow.document.readyState === "complete" &&
      printWindow.document.querySelector(".max-w-4xl") // Check for main content container
    ) {
      return true;
    }
    return false;
  };

  // Function to handle printing
  const handlePrint = () => {
    // Add a small delay to ensure all styles are applied
    setTimeout(() => {
      // Trigger print
      printWindow.print();

      // Add event listener to close window after printing
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
    }, 1000); // 1 second delay after content is loaded
  };

  // Check if page is loaded
  const loadCheck = setInterval(() => {
    if (checkPageLoaded()) {
      clearInterval(loadCheck);
      handlePrint();
    }
  }, 100); // Check every 100ms

  // Fallback if load check fails
  setTimeout(() => {
    clearInterval(loadCheck);
    if (checkPageLoaded()) {
      handlePrint();
    }
  }, 10000); // 10 second maximum wait time
}
