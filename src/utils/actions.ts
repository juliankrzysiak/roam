"use server";

import { PlaceT } from "@/types";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "./supabaseServerClient";

const supabase = createSupabaseServerClient();

export async function createPlace(place: PlaceT) {
  try {
    const { error } = await supabase.from("places").insert(place);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function deletePlace(place: PlaceT) {
  try {
    const { error } = await supabase.from("places").delete().eq("id", place.id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDuration(formData: FormData) {
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
