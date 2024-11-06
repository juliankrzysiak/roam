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
  DropdownMenuGroup,
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
import { useToast } from "@/components/ui/use-toast";
import { DateRange, Trip } from "@/types";
import { calcDateDeltas } from "@/utils";
import { deleteTrip } from "@/utils/actions/crud/delete";
import {
  updateCurrentDate,
  updateTrip,
  updateTripDates,
} from "@/utils/actions/crud/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { eachDayOfInterval, isWithinInterval } from "date-fns";
import { EllipsisVertical, Pencil, Printer, Share, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema";
import { getAlertStrings, getIsSameDateRange } from "../utils";
import ShareTrip from "./ShareTrip";

type TripOptionsProps = {
  tripId: string;
  name: string;
  dateRange: DateRange;
  currentDate: string;
  datesWithPlaces: Date[];
  sharing: Trip["sharing"];
};

export default function TripOptions({
  tripId,
  name,
  dateRange,
  currentDate,
  datesWithPlaces,
  sharing,
}: TripOptionsProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="absolute right-1 top-2"
          aria-label="Open options"
        >
          <EllipsisVertical size={18} className="text-slate-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <ShareTrip tripId={tripId} sharing={sharing}>
                <>
                  <Share />
                  <span>Share</span>
                </>
              </ShareTrip>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer />
              <span>Print</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenEdit(true)}
            >
              <Pencil />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenDelete(true)}
            >
              <Trash />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTrip
        open={openEdit}
        setOpen={setOpenEdit}
        tripId={tripId}
        initialName={name}
        initialDateRange={dateRange}
        currentDate={currentDate}
        datesWithPlaces={datesWithPlaces}
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
  datesWithPlaces: Date[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function EditTrip({
  tripId,
  initialName,
  initialDateRange,
  currentDate,
  datesWithPlaces,
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

  // TODO: Renew data with useEffect when new data is here

  async function onSubmit({
    name,
    dateRange: newDateRange,
  }: z.infer<typeof formSchema>) {
    const isSameDate = getIsSameDateRange(initialDateRange, newDateRange);

    const [initialDates, newDates] = [initialDateRange, newDateRange].map(
      (range) => eachDayOfInterval({ start: range.from, end: range.to }),
    );
    const [datesToAdd, datesToRemove] = calcDateDeltas(initialDates, newDates);

    const alertDates = getAlertStrings(
      newDateRange.datesWithPlaces,
      datesToRemove,
    );

    // * Logic regarding when to open extra dialog confirming deleting dates with places
    if (alertDates.length && !openConfirm) {
      setAlertDates(alertDates);
      setOpenConfirm(true);
    } else submitFormData();

    async function submitFormData() {
      if (name !== initialName) await updateTrip(tripId, name);
      if (newDateRange && !isSameDate) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        await updateTripDates(tripId, [datesToAdd, datesToRemove], timezone);
        if (
          !isWithinInterval(currentDate, {
            start: newDateRange.from,
            end: newDateRange.to,
          })
        )
          await updateCurrentDate(tripId, newDateRange.from);
      }
      setOpenConfirm(false);
      setOpen(false);
    }
  }

  function handleOnOpenChange(open: boolean) {
    setOpen(open);
    form.reset();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOnOpenChange}>
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
                        datesWithPlaces={datesWithPlaces}
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
  const router = useRouter();
  const { toast } = useToast();
  async function handleSubmit(formData: FormData) {
    toast({ description: "Trip deleted" });
    router.back();
    await deleteTrip(formData);
    router.refresh();
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
