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
import { formSchema } from "../schema";
import { getEachDateInRange } from "../utils";

export default function NewTripForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dateRange: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, dateRange } = values;
    const dates = getEachDateInRange(dateRange.from, dateRange?.to);
    await createTrip(name, dates);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create New Trip</Button>
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
