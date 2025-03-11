import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BasePDF, styles, formatDate } from "./BasePDF";

// Air Balancing PDF Component
export const AirBalancingPDF = ({ data }) => {
  if (!data)
    return (
      <BasePDF title="Air Balancing Report">
        <Text>No data available</Text>
      </BasePDF>
    );

  return (
    <BasePDF title="Air Balancing Report">
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Information</Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>System Type:</Text>
            <Text style={styles.value}>{data.systemType || "N/A"}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Manufacturer:</Text>
            <Text style={styles.value}>{data.manufacturer || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Model Number:</Text>
            <Text style={styles.value}>{data.modelNumber || "N/A"}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Serial Number:</Text>
            <Text style={styles.value}>{data.serialNumber || "N/A"}</Text>
          </View>
        </View>
      </View>

      {data.measurements && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurements</Text>

          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#EEEEEE",
              paddingBottom: 5,
              marginBottom: 5,
            }}
          >
            <Text style={{ flex: 1, fontSize: 9, fontWeight: "bold" }}>
              Location
            </Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: "bold" }}>
              Design CFM
            </Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: "bold" }}>
              Actual CFM
            </Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: "bold" }}>
              Deviation %
            </Text>
          </View>

          {data.measurements.map((measurement, index) => (
            <View key={index} style={{ flexDirection: "row", marginBottom: 3 }}>
              <Text style={{ flex: 1, fontSize: 8 }}>
                {measurement.location || "N/A"}
              </Text>
              <Text style={{ flex: 1, fontSize: 8 }}>
                {measurement.designCFM || "N/A"}
              </Text>
              <Text style={{ flex: 1, fontSize: 8 }}>
                {measurement.actualCFM || "N/A"}
              </Text>
              <Text style={{ flex: 1, fontSize: 8 }}>
                {measurement.deviation || "N/A"}
              </Text>
            </View>
          ))}
        </View>
      )}

      {data.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={{ fontSize: 9 }}>{data.notes}</Text>
        </View>
      )}

      {data.conclusion && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conclusion</Text>
          <Text style={{ fontSize: 9 }}>{data.conclusion}</Text>
        </View>
      )}
    </BasePDF>
  );
};
