"use client";

import { DatePicker } from "@/components/general/DatePicker";
import { DateRange, Day } from "@/types";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

type MapControlsProps = {
  tripId: string;
  day: Day;
  dateRange: DateRange;
};

export default function MapDatePicker({
  tripId,
  day,
  dateRange,
}: MapControlsProps) {
  const map = useMap();

  useEffect(() => {
    const firstLocation = day.places.at(0)?.position;
    if (!map || !firstLocation) return;
    map.panTo(firstLocation);
    map.panBy(0, -150);
  }, [day.id]);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg border-2 border-emerald-900">
      <DatePicker
        initialDate={day.date}
        dateRange={dateRange}
        tripId={tripId}
      />
    </div>
  );
}
