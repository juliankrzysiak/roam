"use client";

import { DatePicker } from "@/components/general/DatePicker";
import { Input } from "@/components/ui/input";
import { DayInfo } from "@/types";
import { parseDate } from "@/utils";
import { format } from "date-fns";
import { useOptimistic, useState } from "react";
import { addMinutes, parse } from "date-fns";

type Props = {
  dayInfo: DayInfo;
  totalDuration: number;
};

export default function DayControls({ dayInfo, totalDuration }: Props) {
  const [startTime, setStartTime] = useState(dayInfo.startTime.slice(0, 5));
  const endTime = addMinutes(
    parse(startTime, "HH:mm", new Date()),
    totalDuration,
  );

  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center rounded-lg  bg-background p-2 shadow-lg">
      <div className="flex gap-2">
        <div className="flex flex-col items-center justify-between gap-2">
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
            defaultValue={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        {/* <DatePicker
        initialDate={parseDate(dayInfo.date)}
        dayId={dayInfo.currentDayId}
      /> */}
        <div className="flex flex-col items-center justify-between">
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
          <Input type="time" defaultValue={format(endTime, "HH:mm")} />
        </div>
      </div>
    </div>
  );
}
