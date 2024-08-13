"use server";

import { calcDateDeltas, convertTime, formatBulkDates } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { eachDayOfInterval, format } from "date-fns";
import { revalidatePath } from "next/cache";
import { DateRange } from "@/types";

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
  ranges: [Date[], Date[]],
) {
  const supabase = createClient();
  const [daysToAdd, daysToRemove] = ranges;

  if (daysToAdd.length) {
    const bulkDates = formatBulkDates(tripId, daysToAdd);
    try {
      const { error } = await supabase.from("days").insert(bulkDates);
      if (error) throw new Error(`Supabase error: ${error.message}`);
      revalidatePath("/trips");
    } catch (error) {
      console.log(error);
    }
  }

  if (daysToRemove.length) {
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
    revalidatePath("/[tripId]", "page");
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
    revalidatePath("/[tripId]", "page");
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
    revalidatePath("/[tripId]", "page");
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
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updateCurrentDate(tripId: string, date: Date) {
  const supabase = createClient();
  const current_date = date.toISOString();

  try {
    const { error } = await supabase
      .from("trips")
      .update({ current_date })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updateNotes(notes: string, id: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("places")
      .update({ notes })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[trip]", "page");
  } catch (error) {
    console.log(error);
  }
}
