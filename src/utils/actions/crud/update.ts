"use server";

import { createClient } from "@/utils/supabase/server";
import { formatISO, parse } from "date-fns";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { convertTime } from "@/utils";

export async function updateTrip(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const name = formData.get("name");
  const tripId = formData.get("tripId");

  try {
    if (typeof name !== "string") return;
    const { error } = await supabase
      .from("trips")
      .update({ name })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
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

export async function updateDay(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const current_day = formData.get("dayId");

  try {
    if (typeof current_day !== "string") throw new Error();
    const { error } = await supabase
      .from("trips")
      .update({ current_day })
      .eq("id", formData.get("tripId"));
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

export async function updateDate(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const dayId = formData.get("dayId");
  const date = formData.get("");
  try {
    const { error } = await supabase
      .from("days")
      .update({ current_day: dayId })
      .eq("id");
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}
