"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


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

export async function updateDuration(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const id = formData.get("id");
  const rawFormData = {
    duration: formData.get("duration"),
  };
  try {
    const { error } = await supabase
      .from("places")
      .update(rawFormData)
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
  const rawFormData = {
    start_time: formData.get("startTime"),
  };
  // TODO: Add day here
  try {
    const { error } = await supabase
      .from("days")
      .update(rawFormData)
      .eq("id", 3);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDay(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const rawFormData = {
    day_id: formData.get("dayId"),
  };

  try {
    const { error } = await supabase
      .from("trips")
      .update(rawFormData)
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

export async function updateDayOrder(tripId: number, order: string[]) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // const rawFormData = {
  //   trip_id: formData.get("trip"),
  // };

  try {
    const { error } = await supabase
      .from("trips")
      .update({ order_days: order })
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