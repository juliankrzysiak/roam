"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { updateCurrentDate } from "@/utils/actions/crud/update";
import { useOptimistic, useState } from "react";
import { DateRange } from "@/types";

type Props = {
  tripId: string;
  initialDate: Date;
  dateRange: DateRange;
};

export function DatePicker({ tripId, initialDate, dateRange }: Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [optimisticDate, setOptimisticDate] = useOptimistic<Date | undefined>(
    initialDate,
    // @ts-expect-error
    (_state, newDate) => newDate,
  );

  const dateMatcher = {
    before: dateRange.from,
    after: dateRange.to || dateRange,
  };

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger onClick={() => setCalendarOpen(true)} asChild>
        <Button
          variant={"outline"}
          className={cn(
            "min-w-max max-w-xs justify-start text-left font-normal",
            !optimisticDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {optimisticDate ? (
            format(optimisticDate, "eee, MMM d")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          required
          defaultMonth={optimisticDate}
          disabled={dateMatcher}
          selected={optimisticDate}
          onSelect={async (date) => {
            if (!date) return;
            setOptimisticDate(date);
            await updateCurrentDate(tripId, date);
            setCalendarOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
