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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Trip } from "@/types";
import { setCookie } from "@/utils/actions/cookies";
import { updateSharing, updateSharingId } from "@/utils/actions/crud/update";
import { DialogClose } from "@radix-ui/react-dialog";
import { format, isEqual } from "date-fns";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TripOptions from "./TripOptions";

const dateFormat = "MMM dd";

const host =
  process.env.NODE_ENV === "development"
    ? "localhost:3000"
    : "https://roam-gamma.vercel.app";

export default function TripCard({
  tripId,
  name,
  dateRange,
  currentDate,
  sharing,
  sharingId,
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
        <ShareTrip sharing={sharing} sharingId={sharingId} tripId={tripId} />
      </div>
    </article>
  );
}

type ShareTripProps = {
  sharing: boolean;
  sharingId: string | null;
  tripId: string;
};

function ShareTrip({ tripId, sharing, sharingId }: ShareTripProps) {
  const { toast } = useToast();
  const [checked, setChecked] = useState(sharing);

  const [locked, setLocked] = useState(true);
  const sharingLinkBase = `${host}/${tripId}?sharing=`;
  const defaultSharingLink = sharingId ? sharingLinkBase + sharingId : "";
  const [sharingLink, setSharingLink] = useState(defaultSharingLink);

  useEffect(() => {
    const locked = localStorage.getItem("locked");
    if (typeof locked !== "string") return;
    const initialLocked = Boolean(JSON.parse(locked));
    setLocked(initialLocked);
  }, []);

  async function submitSharingForm() {
    if (checked === sharing) return;
    await updateSharing(checked, tripId);
  }

  async function submitSharingIdForm() {
    const sharingId = await updateSharingId(tripId);
    if (!sharingId) return;
    setSharingLink(sharingLinkBase + sharingId);
    toast({ description: "New link created." });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(sharingLink);
    toast({ description: "Link copied." });
  }

  function lockLink() {
    const newLocked = !locked;
    localStorage.setItem("locked", JSON.stringify(newLocked));
    setLocked(newLocked);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          Share trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Create Trip Link</DialogTitle>
              <DialogDescription>
                The trip will not be editable by anyone except you.
              </DialogDescription>
            </DialogHeader>
            <form
              action={submitSharingIdForm}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-center">{sharingLink}</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={lockLink}
                  aria-label={
                    (locked ? "Unlock" : "Lock") + " creating new link"
                  }
                >
                  {locked ? <LockKeyhole /> : <LockKeyholeOpen />}
                </Button>
                <Button disabled={locked}>Create new link</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={copyToClipboard}
                >
                  Copy link
                </Button>
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Change Sharing Status</DialogTitle>
              <DialogDescription>
                This is regardless of any link created or shared.
              </DialogDescription>
            </DialogHeader>
            <form action={submitSharingForm} id="sharingForm">
              <label className="flex items-center gap-4">
                {`Sharing is ${checked ? "on" : "off"}`}
                <Switch
                  checked={checked}
                  onCheckedChange={() => setChecked(!checked)}
                />
              </label>
            </form>
          </div>
        </div>
        <DialogFooter className="mt-4">
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
