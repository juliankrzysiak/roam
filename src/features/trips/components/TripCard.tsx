"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trip } from "@/types";
import { setCookie } from "@/utils/actions/cookies";
import { format, isEqual } from "date-fns";
import Link from "next/link";
import TripOptions from "./TripOptions";
import { useState } from "react";
import { updateSharing } from "@/utils/actions/crud/update";
import { DialogClose } from "@radix-ui/react-dialog";

const dateFormat = "MMM dd";

export default function TripCard({
  tripId,
  name,
  dateRange,
  currentDate,
  sharing,
}: Trip) {
  let range = format(dateRange.from, dateFormat);
  if (!isEqual(dateRange.from, dateRange.to))
    range += ` - ${format(dateRange.to, dateFormat)}`;

  async function handleClick() {
    setCookie("tripId", tripId);
  }

  return (
    <article className="relative flex flex-col items-center justify-between gap-2 rounded-lg bg-slate-100 p-6 text-center">
      <TripOptions
        tripId={tripId}
        name={name}
        dateRange={dateRange}
        currentDate={currentDate}
      />
      {sharing && (
        <span className="absolute left-2 top-2 text-sm text-slate-500">
          shared
        </span>
      )}
      <h3 className="text-2xl font-semibold">{name}</h3>
      <p>{range}</p>
      <div className="mt-4 flex w-full gap-2">
        <Button variant="default" size="sm" asChild className="flex-1">
          <Link href={`/${tripId}`} onClick={handleClick}>
            Start planning
          </Link>
        </Button>
        <ShareTrip sharing={sharing} tripId={tripId} />
      </div>
    </article>
  );
}

type ShareTripProps = {
  sharing: boolean;
  tripId: string;
};

function ShareTrip({ tripId, sharing }: ShareTripProps) {
  const [checked, setChecked] = useState(sharing);

  async function submitSharingForm() {
    await updateSharing(checked, tripId);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          Share trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Trip</DialogTitle>
          <DialogDescription>
            Create a link to share your trip with friends. The trip will not be
            editable by anyone except you.
          </DialogDescription>
        </DialogHeader>
        <form action="" className="flex flex-col items-center gap-4">
          <Input />
          <Button>Create new link</Button>
        </form>
        <form
          action={submitSharingForm}
          id="sharingForm"
          className="flex items-center gap-2"
        >
          <span className="flex items-center gap-2">
            {`Sharing for this trip is ${checked ? "on" : "off"}`}
            <Switch
              checked={checked}
              onCheckedChange={() => setChecked(!checked)}
            />
          </span>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" form="sharingForm">
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
