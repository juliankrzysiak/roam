"use client";

import { DatePicker } from "@/components/general/DatePicker";
import { DateRange, Day } from "@/types";
import { ControlPosition, MapControl, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

type MapControlsProps = {
  tripId: string;
  day: Day;
  dateRange: DateRange;
  datesWithPlaces: Date[];
};

export default function MapDatePicker({
  tripId,
  day,
  dateRange,
  datesWithPlaces,
}: MapControlsProps) {
  const map = useMap();

  useEffect(() => {
    const lastLocation = day.places.at(-1)?.position;
    if (!map || !lastLocation) return;
    map.panTo(lastLocation);
  }, [day.id]);

  return (
    <MapControl position={ControlPosition.BOTTOM_CENTER}>
      <div className="mb-4 rounded-lg border-2 border-emerald-800">
        <DatePicker
          tripId={tripId}
          initialDate={day.date}
          dateRange={dateRange}
          datesWithPlaces={datesWithPlaces}
        />
      </div>
    </MapControl>
  );
}
