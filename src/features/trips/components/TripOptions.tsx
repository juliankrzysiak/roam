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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../schema";
import { z } from "zod";

type Props = {
  id: string;
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
  id: string;
  name: string;
  dateRange: DateRange;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function EditTrip({
  id,
  name: initialName,
  dateRange: initialDateRange,
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
    const isSameDate =
      dateRange.from === initialDateRange.from &&
      dateRange.to === initialDateRange.to;

    if (name !== initialName) await updateTrip(id, name);
    if (dateRange && !isSameDate)
      await updateTripDates(id, [initialDateRange, dateRange]);
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
