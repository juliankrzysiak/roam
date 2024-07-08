"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePlace(id: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("places").delete().eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[trip]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTrip(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("tripId");
  if (!id) return;

  try {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteDay(dayId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase.from("days").delete().eq("id", dayId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}
