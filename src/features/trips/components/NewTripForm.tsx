"use client";

import { DatePickerWithRange } from "@/components/general/DatePickerWithRange";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createTrip } from "@/utils/actions/crud/create";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newTripFormSchema } from "../schema";
import { getEachDateInRange } from "../utils";
import { useToast } from "@/components/ui/use-toast";

export default function NewTripForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newTripFormSchema>>({
    resolver: zodResolver(newTripFormSchema),
    defaultValues: {
      name: "",
      dateRange: {},
    },
  });

  async function onSubmit(values: z.infer<typeof newTripFormSchema>) {
    const { name, dateRange } = values;
    const dates = getEachDateInRange(dateRange.from, dateRange.to);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await createTrip(name, dates, timezone);
    toast({ description: "New trip created" });
    setOpen(false);
  }

  function handleOnOpenChange(open: boolean) {
    setOpen(open);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Trip</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="createTrip"
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
                    <Input placeholder="Antelope Valley" {...field} />
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
          <Button form="createTrip">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
