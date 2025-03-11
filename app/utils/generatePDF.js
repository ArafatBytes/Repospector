import { toast } from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// Import PDF document components
import { SpecialInspectionPDF } from "../components/pdf/SpecialInspectionPDF";
import { AirBalancingPDF } from "../components/pdf/AirBalancingPDF";
import { ConcretePDF } from "../components/pdf/ConcretePDF";
import { DailyFieldPDF } from "../components/pdf/DailyFieldPDF";
import { FirestoppingPDF } from "../components/pdf/FirestoppingPDF";
import { InsulationPDF } from "../components/pdf/InsulationPDF";
import { ParapetPDF } from "../components/pdf/ParapetPDF";
import { StructuralPDF } from "../components/pdf/StructuralPDF";

export async function generateInspectionPDF(
  inspectionId,
  projectName,
  reportType = "SPECIAL_INSPECTION"
) {
  try {
    // Show loading toast
    const loadingToast = toast.loading("Generating PDF...");

    // Ensure inspectionId is valid
    if (!inspectionId) {
      throw new Error("Report ID is required");
    }

    // Fetch the report data
    const response = await fetch(`/api/inspections/${inspectionId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch report data");
    }

    const reportData = await response.json();

    // Create a safe filename
    const safeProjectName = (projectName || "report")
      .toString()
      .replace(/[^a-z0-9_-]/gi, "_");
    const fileName = `${(
      reportType || "report"
    ).toLowerCase()}_${safeProjectName}.pdf`;

    // Select the appropriate PDF component based on report type
    let PDFDocument;
    switch (reportType) {
      case "SPECIAL_INSPECTION":
        PDFDocument = SpecialInspectionPDF;
        break;
      case "AIR_BALANCING":
        PDFDocument = AirBalancingPDF;
        break;
      case "CONCRETE":
        PDFDocument = ConcretePDF;
        break;
      case "DAILY_FIELD":
        PDFDocument = DailyFieldPDF;
        break;
      case "FIRESTOPPING":
        PDFDocument = FirestoppingPDF;
        break;
      case "INSULATION":
        PDFDocument = InsulationPDF;
        break;
      case "PARAPET":
        PDFDocument = ParapetPDF;
        break;
      case "STRUCTURAL":
        PDFDocument = StructuralPDF;
        break;
      default:
        throw new Error("Invalid report type");
    }

    // Generate the PDF blob
    const blob = await pdf(<PDFDocument data={reportData} />).toBlob();

    // Save the PDF file
    saveAs(blob, fileName);

    // Show success toast
    toast.success("PDF downloaded successfully", { id: loadingToast });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error(error.message || "Failed to generate PDF");
  }
}
