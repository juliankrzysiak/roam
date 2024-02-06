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
import { updateTrip } from "@/utils/actions";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import MoreSVG from "@/assets/more-vertical.svg";
import { deleteTrip } from "@/utils/actions";

type Props = {
  id: number;
};

export default function TripOptions({ id }: Props) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateTrip(formData);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="absolute right-2 top-2"
          aria-label="Open options"
        >
          <MoreSVG />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span>Edit Trip</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action={deleteTrip}>
              <input type="hidden" name="tripId" value={id} />
              <button>Delete</button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          id="createTrip"
          className="flex flex-col items-center gap-2"
        >
          <input type="hidden" name="tripId" value={id} />
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
