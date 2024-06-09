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
import { updateTrip, updateTripDates } from "@/utils/actions/crud/update";

import MoreSVG from "@/assets/more-vertical.svg";
import DeleteTrip from "./DeleteTrip";
import { DatePickerWithRange } from "@/components/general/DatePickerWithRange";
import { DateRange } from "react-day-picker";

type Props = {
  id: number;
  name: string;
  dateRange: DateRange;
};

export default function TripOptions({ id, name, dateRange }: Props) {
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
      <EditTrip
        open={openEdit}
        setOpen={setOpenEdit}
        id={id}
        name={name}
        dateRange={dateRange}
      />
      <DeleteTrip open={openDelete} setOpen={setOpenDelete} id={id} />
    </>
  );
}

type EditTripProps = {
  name: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  dateRange: DateRange;
};

function EditTrip({ open, setOpen, id, name, dateRange }: EditTripProps) {
  const [date, setDate] = useState<DateRange | undefined>(dateRange);

  async function submitForm(formData: FormData) {
    const formName = formData.get("name") as string;
    const isSameDate =
      dateRange.from === date?.from && dateRange.to === date?.to;

    if (formName !== name) await updateTrip(formData);
    if (date && !isSameDate) await updateTripDates(id, [dateRange, date]);
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
          <label>
            Dates
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
