"use client";

import { DatePicker } from "@/components/general/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Day } from "@/types";
import { updateStartTime } from "@/utils/actions/crud/update";
import { addMinutes, format, parse } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

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

type TimePickerProps = Omit<MapControlsProps, "tripId" | "dateRange">;

export function TimePicker({ day }: TimePickerProps) {
  const [startTime, setStartTime] = useState(day.startTime.slice(0, 5));
  const endTime = day.places.at(-1)?.departure;

  return (
    <form
      className="flex items-center justify-between gap-2 rounded-lg bg-background p-2 shadow-lg"
      action={updateStartTime}
    >
      <label className="flex gap-2" aria-label="Start Time">
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
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
        <Input
          type="time"
          id="startTime"
          name="startTime"
          defaultValue={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input type="hidden" name="id" defaultValue={day.id} />
      </label>

      <div className="flex items-center justify-between gap-2">
        <label htmlFor="endTime">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        </label>
        <span id="endTime">{format(endTime, "h:mm aa")}</span>
      </div>
      <Button variant="outline" size="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </Button>
    </form>
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
