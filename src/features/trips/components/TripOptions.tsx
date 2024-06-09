"use client";

import { Dispatch, SetStateAction, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import MoreSVG from "@/assets/more-vertical.svg";
import { DatePickerWithRange } from "@/components/general/DatePickerWithRange";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteTrip } from "@/utils/actions/crud/delete";
import { updateTrip, updateTripDates } from "@/utils/actions/crud/update";
import { DialogDescription } from "@radix-ui/react-dialog";
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
  id: number;
  name: string;
  dateRange: DateRange;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function EditTrip({ id, name, dateRange, open, setOpen }: EditTripProps) {
  // TODO: Add notifications for form information
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
            <DatePickerWithRange dateRange={date} setDateRange={setDate} />
          </label>
        </form>
        <DialogFooter>
          <Button form="createTrip">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTrip({
  id,
  open,
  setOpen,
}: Omit<EditTripProps, "name" | "dateRange">) {
  async function handleSubmit(formData: FormData) {
    await deleteTrip(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>
        <form
          action={handleSubmit}
          id="createTrip"
          className="flex justify-center gap-4"
        >
          <input type="hidden" name="tripId" value={id} />
          <Button type="submit" variant="destructive">
            Yes, Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            No, Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
