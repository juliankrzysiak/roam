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

export async function updateTrip(id: number, name: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
  tripId: number,
  ranges: [DateRange, DateRange],
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const [initialDates, newDates] = ranges.map((range) =>
    eachDayOfInterval({ start: range.from, end: range.to }),
  );

  const [daysToAdd, daysToRemove] = calcDateDeltas(initialDates, newDates);

  if (daysToAdd) {
    const bulkDates = formatBulkDates(tripId, daysToAdd);
    try {
      const { error } = await supabase.from("days").insert(bulkDates);
      if (error) throw new Error(`Supabase error: ${error.message}`);
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const id = formData.get("id");
  const hours = Number(formData.get("hours"));
  const minutes = Number(formData.get("minutes"));
  const { minutes: placeDuration } = convertTime({ hours, minutes });

  try {
    const { error } = await supabase
      .from("places")
      .update({ placeDuration })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateTripDuration(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const id = formData.get("id");
  const hours = Number(formData.get("hours"));
  const minutes = Number(formData.get("minutes"));
  const { minutes: tripDuration } = convertTime({ hours, minutes });

  try {
    const { error } = await supabase
      .from("places")
      .update({ tripDuration })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateStartTime(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const id = formData.get("id");
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

export async function updatePlaceOrder(order: string[], dayId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { error } = await supabase
      .from("days")
      .update({ order_places: order })
      .eq("id", dayId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDayOrder(tripId: number, orderDays: string[]) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

export async function updateCurrentDay(tripId: number, dayId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { error } = await supabase
      .from("trips")
      .update({ current_day: dayId })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDate(date: Date, id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const parsedDate = sliceDate(date);

  try {
    const { data, error } = await supabase
      .from("days")
      .update({ date: parsedDate })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
    const returnedDate = data.date;
    if (!returnedDate) return;
    return returnedDate;
  } catch (error) {
    console.log(error);
  }
}
