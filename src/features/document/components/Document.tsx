import React from "react";
import {
  Document as PDF,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default function Document() {
  return (
    <PDF>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1 poop</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </PDF>
  );
}

