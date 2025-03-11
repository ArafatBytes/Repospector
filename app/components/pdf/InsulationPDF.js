import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BasePDF, styles, formatDate } from "./BasePDF";

// Insulation PDF Component
export const InsulationPDF = ({ data }) => {
  if (!data)
    return (
      <BasePDF title="Insulation Inspection Report">
        <Text>No data available</Text>
      </BasePDF>
    );

  return (
    <BasePDF title="Insulation Inspection Report">
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Project Name:</Text>
          <Text style={styles.value}>{data.projectName || "N/A"}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(data.date)}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{data.location || "N/A"}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Inspector:</Text>
          <Text style={styles.value}>{data.inspector || "N/A"}</Text>
        </View>
      </View>

      {/* Add more insulation-specific fields here */}

      {data.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={{ fontSize: 9 }}>{data.notes}</Text>
        </View>
      )}
    </BasePDF>
  );
};
