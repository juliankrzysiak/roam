"use client";

import { DatePickerWithRange } from "@/components/general/DatePickerWithRange";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateRange } from "@/types";
import { calcDateDeltas } from "@/utils";
import { deleteTrip } from "@/utils/actions/crud/delete";
import { getAlertDates } from "@/utils/actions/crud/get";
import {
  updateCurrentDate,
  updateTrip,
  updateTripDates,
} from "@/utils/actions/crud/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { eachDayOfInterval, isEqual, isWithinInterval } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema";

type TripOptionsProps = {
  tripId: string;
  name: string;
  dateRange: DateRange;
  currentDate: string;
};

export default function TripOptions({
  tripId,
  name,
  dateRange,
  currentDate,
}: TripOptionsProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // TODO: Fix dropdown not opening after using datepicker and clicking outside the modal
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="absolute right-1 top-2"
          aria-label="Open options"
        >
          <EllipsisVertical size={20} className="text-slate-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenEdit(true)}
          >
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href={`/${tripId}/pdf`}>Print</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenDelete(true)}
          >
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTrip
        open={openEdit}
        setOpen={setOpenEdit}
        tripId={tripId}
        initialName={name}
        initialDateRange={dateRange}
        currentDate={currentDate}
      />
      <DeleteTrip open={openDelete} setOpen={setOpenDelete} tripId={tripId} />
    </>
  );
}

/* -------------------------------- EditTrip -------------------------------- */

type EditTripProps = {
  tripId: string;
  initialName: string;
  initialDateRange: DateRange;
  currentDate: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function EditTrip({
  tripId,
  initialName,
  initialDateRange,
  currentDate,
  open,
  setOpen,
}: EditTripProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [alertDates, setAlertDates] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      dateRange: initialDateRange,
    },
  });

  async function onSubmit({ name, dateRange }: z.infer<typeof formSchema>) {
    const isSameDate =
      isEqual(dateRange.from, initialDateRange.from) &&
      isEqual(dateRange.to, initialDateRange.to);

    const [initialDates, newDates] = [initialDateRange, dateRange].map(
      (range) =>
        eachDayOfInterval({ start: range.from, end: range.to ?? range.from }),
    );
    const [datesToAdd, datesToRemove] = calcDateDeltas(initialDates, newDates);

    if (datesToRemove.length && !openConfirm) {
      const alertDates = await getAlertDates(tripId, datesToRemove);
      if (alertDates?.length) {
        setAlertDates(alertDates);
        setOpenConfirm(true);
      } else {
        submitFormData();
      }
    } else {
      submitFormData();
    }

    async function submitFormData() {
      if (name !== initialName) await updateTrip(tripId, name);
      if (dateRange && !isSameDate) {
        await updateTripDates(tripId, [datesToAdd, datesToRemove]);
        if (
          !isWithinInterval(currentDate, {
            start: dateRange.from,
            end: dateRange.to,
          })
        )
          await updateCurrentDate(tripId, dateRange.from);
      }
      setOpenConfirm(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id="updateTrip"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dates *</FormLabel>
                    <FormControl>
                      <DatePickerWithRange
                        dateRange={field.value}
                        setDateRange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button form="updateTrip">Submit</Button>
          </DialogFooter>
        </DialogContent>
        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete your saved places?
              </DialogTitle>
              <ol className="py-4">
                {alertDates.map((date) => {
                  return <li key={date}>{date}</li>;
                })}
              </ol>
              <DialogDescription>
                These dates are being removed that still have saved places. Move
                these places to a new date, or continue with deletion.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button form="updateTrip">Submit</Button>
              <DialogClose asChild>
                <Button variant="secondary">Go Back</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Dialog>
    </>
  );
}

/* ------------------------------- DeleteTrip ------------------------------- */

function DeleteTrip({
  tripId,
  open,
  setOpen,
}: Pick<EditTripProps, "tripId" | "open" | "setOpen">) {
  async function handleSubmit(formData: FormData) {
    await deleteTrip(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <form
          action={handleSubmit}
          id="createTrip"
          className="flex justify-between"
        >
          <input type="hidden" name="tripId" value={tripId} />
          <Button type="submit" variant="destructive">
            Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Go Back
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
