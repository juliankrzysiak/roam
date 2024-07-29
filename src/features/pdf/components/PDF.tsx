"use client";

import { Day, Place } from "@/types";
import { convertTime, formatPlaceDuration, formatTravelTime } from "@/utils";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";

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
            {day.places.map((place) => (
              <PDFPlace key={place.id} place={place} />
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
}

type PlaceProps = {
  place: Place;
};

function PDFPlace({ place }: PlaceProps) {
  const placeDuration = formatPlaceDuration(
    convertTime({ minutes: place.placeDuration }),
  );
  const arrival = format(place.schedule.arrival, timeFormat);
  const departure = format(place.schedule.departure, timeFormat);
  let travelTime;
  if (place.travel) {
    travelTime = formatTravelTime(
      convertTime({ minutes: place.travel.duration }),
    );
  }

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View wrap={false} style={{ flexDirection: "column", gap: 4 }}>
        <View>
          <Text style={[styles.fontBase, { textDecoration: "underline" }]}>
            {place.name}
          </Text>
          <Text style={styles.fontXs}>{place.address}</Text>
        </View>
        <View style={styles.fontXs}>
          <View>
            <Text>A: {arrival}</Text>
            <Text>D: {placeDuration}</Text>
            <Text>D: {departure}</Text>
          </View>
          {travelTime && <Text style={{ marginTop: 8 }}>T: {travelTime}</Text>}
        </View>
      </View>
      <Text style={styles.fontXs}>{place.notes}</Text>
    </View>
  );
}
