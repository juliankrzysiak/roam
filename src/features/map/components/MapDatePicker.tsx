"use client";

import { DatePicker } from "@/components/general/DatePicker";
import { DateRange, Day } from "@/types";

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
