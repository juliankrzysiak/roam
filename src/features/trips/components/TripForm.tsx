"use client";

import { DatePickerWithRange } from "@/components/general/DatePickerWithRange";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createTrip } from "@/utils/actions/crud/create";
import { eachDayOfInterval } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function TripForm() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  async function handleSubmit(formData: FormData) {
    const tripName = formData.get("tripName") as string;
    const dates = getEachDateInRange(date.from, date?.to);

    await createTrip(tripName, dates);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Trip</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          id="createTrip"
          className="flex flex-col gap-3"
        >
          <label className="flex w-fit flex-col items-start gap-1">
            Name *
            <Input
              type="text"
              name="tripName"
              placeholder="Palmdale"
              required
            />
          </label>
          <label className="w-fit">
            Dates *
            <DatePickerWithRange date={date} setDate={setDate} />
          </label>
        </form>
        <DialogFooter>
          <Button form="createTrip">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getEachDateInRange(start: Date, end?: Date): Date[] {
  if (!end) return [start];
  else return eachDayOfInterval({ start, end });
}
