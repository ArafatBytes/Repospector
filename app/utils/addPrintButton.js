import { ArrowLeftIcon, PrinterIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { printElementAsPDF } from "./generatePDF";

/**
 * Creates a header section with back button and print button
 *
 * @param {Object} options - Configuration options
 * @param {string} options.reportId - The ID of the report
 * @param {string} options.reportName - The name of the report for the PDF title
 * @param {string} options.contentId - The ID of the HTML element to print
 * @param {string} options.backUrl - The URL to navigate back to (default: /dashboard)
 * @returns {JSX.Element} The header component with back and print buttons
 */
export function ReportHeader({
  reportId,
  reportName,
  contentId,
  backUrl = "/dashboard",
}) {
  const handlePrint = () => {
    try {
      printElementAsPDF(contentId, `${reportName || "Report"}`);
    } catch (error) {
      console.error("Error printing report:", error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 no-print">
      <Link
        href={backUrl}
        className="text-[#4A90E2] hover:text-[#357ABD] transition-colors text-base inline-flex items-center gap-2"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Dashboard
      </Link>
      <button
        onClick={handlePrint}
        className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <PrinterIcon className="h-5 w-5" />
        Print Report
      </button>
    </div>
  );
}
