"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "./supabaseServerClient";
import { PlaceT } from "@/types";

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
