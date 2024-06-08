"use client";

import { Dispatch, SetStateAction, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { updateTrip } from "@/utils/actions/crud/update";

import MoreSVG from "@/assets/more-vertical.svg";
import DeleteTrip from "./DeleteTrip";

type Props = {
  id: number;
  name: string;
};

export default function TripOptions({ id, name }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="absolute right-2 top-2"
          aria-label="Open options"
        >
          <MoreSVG />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTrip open={openEdit} setOpen={setOpenEdit} id={id} name={name} />
      <DeleteTrip open={openDelete} setOpen={setOpenDelete} id={id} />
    </>
  );
}

type EditTripProps = {
  name: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

export function EditTrip({ open, setOpen, id, name }: EditTripProps) {
  async function submitForm(formData: FormData) {
    await updateTrip(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit New Trip</DialogTitle>
        </DialogHeader>
        <form
          action={submitForm}
          id="createTrip"
          className="flex flex-col items-center gap-2"
        >
          <input type="hidden" name="tripId" value={id} />
          <label className="flex w-full flex-col items-start gap-1">
            Name
            <Input type="text" name="name" defaultValue={name} required />
          </label>
        </form>
        <DialogFooter>
          <Button form="createTrip">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
