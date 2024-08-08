"use client";

import { Dispatch, SetStateAction, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { deleteTrip } from "@/utils/actions/crud/delete";
import { updateTrip, updateTripDates } from "@/utils/actions/crud/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { DateRange } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema";

type Props = {
  tripId: string;
  name: string;
  dateRange: DateRange;
};

export default function TripOptions({ tripId, name, dateRange }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

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
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function EditTrip({
  tripId,
  initialName,
  initialDateRange,
  open,
  setOpen,
}: EditTripProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      dateRange: initialDateRange,
    },
  });

  async function onSubmit({ name, dateRange }: z.infer<typeof formSchema>) {
    const supabase = createClient();

    const [initialDates, newDates] = [initialDateRange, dateRange].map(
      (range) =>
        eachDayOfInterval({ start: range.from, end: range.to ?? range.from }),
    );
    const [daysToAdd, daysToRemove] = calcDateDeltas(initialDates, newDates);

    const { data, error } = await supabase
      .from("days")
      .select("date")
      .eq("trip_id", tripId)
      .in(
        "date",
        daysToRemove.map((day) => format(day, "yyyy-MM-dd")),
      );

    const daysForAlert = data?.map((day) => day.date).join(", ");

    if (data?.length > 0) setOpenConfirm(true);
    return;

    const isSameDate =
      dateRange.from === initialDateRange.from &&
      dateRange.to === initialDateRange.to;

    if (name !== initialName) await updateTrip(tripId, name);
    if (dateRange && !isSameDate)
      await updateTripDates(tripId, [initialDateRange, dateRange]);
    setOpen(false);
  }

  return (
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
                  <DatePickerWithRange
                    dateRange={field.value}
                    setDateRange={field.onChange}
                  />
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
    </Dialog>
  );
}

/* ------------------------------- DeleteTrip ------------------------------- */

function DeleteTrip({
  tripId,
  open,
  setOpen,
}: Omit<EditTripProps, "initialName" | "initialDateRange">) {
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
