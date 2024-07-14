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
  page: {
    flexDirection: "column",
    padding: 24,
    gap: 8,
  },
  places: {
    flexDirection: "column",
    gap: 16,
  },
  place: {
    flexDirection: "column",
    gap: 4,
  },

  date: {
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    textDecoration: "underline",
  },
  times: {
    fontSize: 12,
  },
  bold: {
    fontWeight: "bold",
  },
});

type PDFProps = {
  day: Day;
};

const timeFormat = "h:mm aaa";

export default function PDF({ day }: PDFProps) {
  const { places } = day;

  return (
    <PDFViewer className="flex w-full items-stretch">
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.date}>{format(day.date, "EEEE, MMMM d")}</Text>
          </View>
          <View style={styles.places}>
            {places.map((place) => {
              return (
                <View style={styles.place} key={place.id}>
                  <Text style={styles.title}>{place.name}</Text>
                  <View style={styles.times}>
                    <Text>A: {format(place.schedule.arrival, timeFormat)}</Text>
                    {/* <Text>D: {place.placeDuration} min</Text> */}
                    <Text>
                      D: {format(place.schedule.departure, timeFormat)}
                    </Text>
                    {place.travel && (
                      <Text style={{ marginTop: 4 }}>
                        T: {place.travel.duration} min
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
