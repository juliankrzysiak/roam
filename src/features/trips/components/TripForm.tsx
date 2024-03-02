"use client";

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
import {
  createDay,
  createTrip,
  updateCurrentDay,
  updateDayOrder,
} from "@/utils/actions";
import { useState } from "react";

export default function TripForm() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    // TODO: Tidy this up it's ugly
    const tripId = await createTrip(formData);
    if (!tripId) return;
    const dayId = await createDay(tripId);
    if (!dayId) return;
    await updateDayOrder(tripId, [dayId]);
    await updateCurrentDay(tripId, dayId);
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
          className="flex flex-col items-center gap-2"
        >
          <label className="flex w-full flex-col items-start gap-1">
            Name
            <Input type="text" name="name" placeholder="Palmdale" required />
          </label>
        </form>
        <DialogFooter>
          <Button form="createTrip">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
