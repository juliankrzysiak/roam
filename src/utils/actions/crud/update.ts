"use server";

import {
  convertTime,
  calcDateDeltas,
  sliceDate,
  formatBulkDates,
} from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { eachDayOfInterval, format } from "date-fns";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { DateRange } from "react-day-picker";

export async function updateTrip(id: string, name: string) {
  const supabase = createClient();

  try {
    if (typeof name !== "string") return;
    const { error } = await supabase
      .from("trips")
      .update({ name })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

export async function updateTripDates(
  tripId: string,
  ranges: [DateRange, DateRange],
) {
  const supabase = createClient();

  const [initialDates, newDates] = ranges.map((range) =>
    eachDayOfInterval({ start: range.from, end: range.to }),
  );

  const [daysToAdd, daysToRemove] = calcDateDeltas(initialDates, newDates);

  if (daysToAdd) {
    const bulkDates = formatBulkDates(tripId, daysToAdd);
    try {
      const { error } = await supabase.from("days").insert(bulkDates);
      if (error) throw new Error(`Supabase error: ${error.message}`);
      revalidatePath("/trips");
    } catch (error) {
      console.log(error);
    }
  }

  if (daysToRemove) {
    const formattedDates = daysToRemove.map((date) =>
      format(date, "yyy-MM-dd"),
    );

    try {
      const { error } = await supabase
        .from("days")
        .delete()
        .eq("trip_id", tripId)
        .in("date", formattedDates);
      if (error) throw new Error(`Supabase error: ${error.message}`);
    } catch (error) {
      console.log(error);
    }
  }
}

export async function updatePlaceDuration(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  const hours = Number(formData.get("hours"));
  const minutes = Number(formData.get("minutes"));
  const { minutes: place_duration } = convertTime({ hours, minutes });

  try {
    const { error } = await supabase
      .from("places")
      .update({ place_duration })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateTripDuration(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  const hours = Number(formData.get("hours"));
  const minutes = Number(formData.get("minutes"));
  const { minutes: trip_duration } = convertTime({ hours, minutes });

  try {
    const { error } = await supabase
      .from("places")
      .update({ trip_duration })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateStartTime(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  const startTime = formData.get("startTime") as string;

  try {
    const { error } = await supabase
      .from("days")
      .update({ start_time: startTime })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDay(index: number, tripId: number) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("trips")
      .update({ index_current_day: index })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updatePlaceOrder(order_places: string[], dayId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("days")
      .update({ order_places })
      .eq("id", dayId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[trip]");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDayOrder(tripId: number, orderDays: string[]) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("trips")
      .update({ order_days: orderDays })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateCurrentDate(tripId: string, date: Date) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("trips")
      .update({ current_date: date })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}
