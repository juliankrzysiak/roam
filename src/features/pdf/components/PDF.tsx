"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Place } from "@/types";
import { format } from "date-fns";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

type PDFProps = {
  places: Place[];
};

const timeFormat = "h:mm aaa";

export default function PDF({ places }: PDFProps) {
  return (
    <PDFViewer className="flex w-full items-stretch">
      <Document>
        <Page size="A4" style={styles.page}>
          {places.map((place) => {
            return (
              <View style={styles.section}>
                <Text>{place.name}</Text>
                <View>
                  <Text>
                    Arrival: {format(place.schedule.arrival, timeFormat)}
                  </Text>
                  <Text>Duration: {place.placeDuration}</Text>
                  <Text>
                    Departure: {format(place.schedule.departure, timeFormat)}
                  </Text>
                </View>
              </View>
            );
          })}
        </Page>
      </Document>
    </PDFViewer>
  );
}
