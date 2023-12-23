"use server";

import { PlaceT } from "@/types";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function createPlace(place: PlaceT) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase.from("places").insert(place);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function deletePlace(place: PlaceT) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase.from("places").delete().eq("id", place.id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
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

export async function createTrip(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const rawFormData = {
    name: formData.get("name"),
  };
  try {
    const { error } = await supabase.from("trips").insert(rawFormData);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}
