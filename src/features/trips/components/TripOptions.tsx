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
import EditTrip from "./EditTrip";

type Props = {
  id: number;
};

export default function TripOptions({ id }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  async function handleEdit(formData: FormData) {
    await updateTrip(formData);
    setOpenEdit(false);
  }

  async function handleDelete(formData: FormData) {
    await deleteTrip(formData);
    setOpenEdit(false);
  }
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
      <EditTrip open={openEdit} setOpen={setOpenEdit} id={id} />
    </>
  );
}
