"use client";

import { Day } from "@/types";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
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
  fontBase: {
    fontSize: 16,
  },
  fontXs: {
    fontSize: 12,
  },
});

type PDFProps = {
  days: Day[];
};

const timeFormat = "h:mm aaa";

export default function PDF({ days }: PDFProps) {
  return (
    <PDFViewer className="flex w-full items-stretch">
      <Document>
        {days.map((day) => (
          <Page
            key={day.id}
            size="A4"
            style={{
              fontFamily: "Courier",
              flexDirection: "column",
              padding: 24,
              gap: 16,
            }}
          >
            <Text
              fixed
              style={{
                position: "absolute",
                right: 12,
                bottom: 12,
                fontSize: 12,
              }}
            >
              Roam
            </Text>
            <Text style={styles.fontBase}>
              {format(day.date, "EEEE, MMMM d")}
            </Text>
            <View
              style={{
                flexDirection: "column",
                gap: 16,
              }}
            >
              {day.places.map((place) => {
                return (
                  <View
                    wrap={false}
                    style={{ flexDirection: "column", gap: 4 }}
                    key={place.id}
                  >
                    <View>
                      <Text
                        style={[
                          styles.fontBase,
                          { textDecoration: "underline" },
                        ]}
                      >
                        {place.name}
                      </Text>
                      <Text style={styles.fontXs}>{place.address}</Text>
                    </View>
                    <View style={styles.fontXs}>
                      <View>
                        <Text>
                          A: {format(place.schedule.arrival, timeFormat)}
                        </Text>
                        <Text>
                          D: {format(place.schedule.departure, timeFormat)}
                        </Text>
                      </View>
                      {place.travel && (
                        <Text>T: {place.travel.duration} min</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
}
