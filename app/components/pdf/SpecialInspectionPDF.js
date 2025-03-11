import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import { BasePDF, styles, formatDate } from "./BasePDF";

// Helper function to render checkboxes
const Checkbox = ({ checked }) => (
  <View style={checked ? styles.checkboxChecked : styles.checkbox} />
);

// Helper function to render report type
const ReportType = ({ type, nonConformanceReason }) => {
  const isIncompleteWork = type === "INCOMPLETE_WORK";
  const isComplete = type === "COMPLETE";
  const isConformance = type === "CONFORMANCE";
  const isNonConformance = type === "NON_CONFORMANCE";

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>REPORT:</Text>
      <View style={{ flexDirection: "row", marginTop: 5 }}>
        <View style={styles.checkboxRow}>
          <Checkbox checked={isIncompleteWork} />
          <Text style={styles.checkboxLabel}>Incomplete work</Text>
        </View>
        <View style={[styles.checkboxRow, { marginLeft: 20 }]}>
          <Checkbox checked={isComplete} />
          <Text style={styles.checkboxLabel}>Complete</Text>
        </View>
        <View style={[styles.checkboxRow, { marginLeft: 20 }]}>
          <Checkbox checked={isConformance} />
          <Text style={styles.checkboxLabel}>Conformance</Text>
        </View>
        <View style={[styles.checkboxRow, { marginLeft: 20 }]}>
          <Checkbox checked={isNonConformance} />
          <Text style={styles.checkboxLabel}>Non-conformance</Text>
        </View>
      </View>

      {isNonConformance && (
        <View style={{ marginTop: 5, marginLeft: 10 }}>
          <Text style={[styles.label, { fontSize: 9 }]}>
            Reason for Non-conformance:
          </Text>
          <Text style={[styles.value, { fontSize: 9 }]}>
            {nonConformanceReason || "Not provided"}
          </Text>
        </View>
      )}
    </View>
  );
};

// Helper function to render inspection items
const InspectionItems = ({ items }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Inspection Items:</Text>
    {items.map((item, index) => (
      <View key={index} style={styles.checkboxRow}>
        <Checkbox checked={item.approved} />
        <Text style={styles.checkboxLabel}>{item.name}</Text>
        {item.seeComments && (
          <Text
            style={[styles.checkboxLabel, { marginLeft: 5, color: "#4A90E2" }]}
          >
            (See comments)
          </Text>
        )}
      </View>
    ))}
  </View>
);

// Helper function to render images
const ImagesSection = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <View
      style={[
        styles.section,
        { marginTop: 20, borderTop: "1px solid #EEEEEE", paddingTop: 10 },
      ]}
    >
      <Text style={styles.sectionTitle}>
        Comments and additional information, including photographs:
      </Text>

      {images.map((imageGroup, groupIndex) => (
        <View key={groupIndex} style={{ marginTop: 10, marginBottom: 15 }}>
          {imageGroup.urls && imageGroup.urls.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {imageGroup.urls.map((url, urlIndex) => (
                <View key={urlIndex} style={{ width: "30%", margin: "1.5%" }}>
                  <Image
                    src={url}
                    style={{
                      width: "100%",
                      height: 100,
                      objectFit: "contain",
                      marginBottom: 5,
                    }}
                  />
                </View>
              ))}
            </View>
          )}

          {imageGroup.comment && (
            <View style={{ marginTop: 5 }}>
              <Text style={[styles.label, { fontSize: 8 }]}>Comments:</Text>
              <Text style={[styles.value, { fontSize: 8 }]}>
                {imageGroup.comment}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

// Special Inspection PDF Component
export const SpecialInspectionPDF = ({ data }) => {
  if (!data)
    return (
      <BasePDF title="Special Inspection Report">
        <Text>No data available</Text>
      </BasePDF>
    );

  return (
    <BasePDF title="Special Inspection Report">
      <ReportType
        type={data.reportType}
        nonConformanceReason={data.nonConformanceReason}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Inspector Email:</Text>
          <Text style={styles.value}>{data.inspectorEmail || "N/A"}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.value}>{data.client || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>AMAA Project Number:</Text>
          <Text style={styles.value}>{data.amaaProjectNumber || "N/A"}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Sent To:</Text>
          <Text style={styles.value}>{data.sentTo || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Project Name:</Text>
          <Text style={styles.value}>{data.projectName || "N/A"}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>City/County:</Text>
          <Text style={styles.value}>{data.cityCounty || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data.address || "N/A"}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Floor:</Text>
          <Text style={styles.value}>{data.floor || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(data.date)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Time Arrived:</Text>
          <Text style={styles.value}>{data.timeArrived || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Time Departed:</Text>
          <Text style={styles.value}>{data.timeDeparted || "N/A"}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Persons Met:</Text>
          <Text style={styles.value}>{data.personsMet || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>DOB Application:</Text>
          <Text style={styles.value}>{data.dobApplication || "N/A"}</Text>
        </View>
      </View>

      {data.inspectionItems && data.inspectionItems.length > 0 && (
        <InspectionItems items={data.inspectionItems} />
      )}

      {data.images && data.images.length > 0 && (
        <ImagesSection images={data.images} />
      )}
    </BasePDF>
  );
};
