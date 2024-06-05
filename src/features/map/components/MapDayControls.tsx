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
    <div className="absolute bottom-8 left-1/2 flex w-full max-w-lg -translate-x-1/2 items-center bg-background">
      <div className="flex flex-col ">
        <input
          type="time"
          defaultValue={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      {/* <DatePicker
        initialDate={parseDate(dayInfo.date)}
        dayId={dayInfo.currentDayId}
      /> */}
      <input type="time" defaultValue={format(endTime, "HH:mm:ss")} />
    </div>
  );
}
