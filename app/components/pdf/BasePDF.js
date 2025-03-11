import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 200,
    height: 70,
    marginBottom: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "center",
    marginBottom: 20,
    padding: 8,
    backgroundColor: "#F0F7FF",
    borderRadius: 4,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    marginBottom: 5,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  checkbox: {
    width: 12,
    height: 12,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#000000",
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#4A90E2",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  checkboxLabel: {
    fontSize: 9,
  },
  imageContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    maxWidth: "100%",
    maxHeight: 200,
    marginBottom: 5,
    objectFit: "contain",
  },
  imageCaption: {
    fontSize: 8,
    color: "#666666",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: "#666666",
  },
});

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MM/dd/yyyy");
  } catch (error) {
    return dateString;
  }
};

// Base PDF component
export const BasePDF = ({ children, title, logoUrl = "/images/logo.jpg" }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={logoUrl} style={styles.logo} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
      <Text style={styles.footer}>
        Generated on {format(new Date(), "MM/dd/yyyy")}
      </Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

// Export styles and helper functions
export { styles, formatDate };
