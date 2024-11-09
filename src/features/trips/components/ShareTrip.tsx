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
import { updateSharing, updateSharingId } from "@/utils/actions/crud/update";
import { DialogClose } from "@radix-ui/react-dialog";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

const host =
  process.env.NODE_ENV === "development"
    ? "localhost:3000"
    : "https://roam-gamma.vercel.app";

type Props = {
  sharing: Trip["sharing"];
  tripId: string;
  children: ReactNode;
};

export default function ShareTrip({ sharing, tripId, children }: Props) {
  const { isSharing, sharingId } = sharing;
  const { toast } = useToast();
  const [checked, setChecked] = useState(isSharing);

  const [locked, setLocked] = useState(true);
  const sharingLinkBase = `${host}/planner/${tripId}?sharing=`;
  const defaultSharingLink = sharingId ? sharingLinkBase + sharingId : "";
  const [sharingLink, setSharingLink] = useState(defaultSharingLink);

  useEffect(() => {
    const locked = localStorage.getItem("locked");
    if (typeof locked !== "string") return;
    const initialLocked = Boolean(JSON.parse(locked));
    setLocked(initialLocked);
  }, []);

  async function submitSharingForm() {
    if (checked === isSharing) return;
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
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
              <p className="break-all text-center">{sharingLink}</p>
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
