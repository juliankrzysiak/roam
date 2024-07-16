"use client";

import { DatePicker } from "@/components/general/DatePicker";
import { DateRange, Day } from "@/types";

type MapControlsProps = {
  tripId: string;
  day: Day;
  dateRange: DateRange;
};

export default function MapControls({
  tripId,
  day,
  dateRange,
}: MapControlsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg border-2 border-emerald-900">
      {/* <TimePicker day={day} /> */}
      <DatePicker
        initialDate={day.date}
        dateRange={dateRange}
        tripId={tripId}
      />
      {/* <PlacePicker /> */}
    </div>
  );
}



function PlacePicker() {
  return (
    <div className="flex items-center justify-between gap-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      <span>1</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </div>
  );
}
