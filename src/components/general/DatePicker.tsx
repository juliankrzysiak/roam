"use client";

import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { updateDate } from "@/utils/actions/crud/update";

type Props = {
  initialDate: Date;
  dayId: string;
};

export function DatePicker({ initialDate, dayId }: Props) {
  const [date, setDate] = useState<Date | undefined>(initialDate);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={async (date) => {
            if (!date) return;
            const updatedDate = await updateDate(date, dayId);
            if (!updatedDate) return;
            setDate(parse(updatedDate, "yyyy-MM-dd", new Date()));
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
