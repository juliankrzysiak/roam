"use server";

import { PlaceT } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Auth //

type Payload = {
  email: string;
  data: {
    name: string;
  };
};

export async function updateAccount(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const payload = {
    email: formData.get("email"),
    data: { name: formData.get("name") },
  } as Payload;

  try {
    const { error } = await supabase.auth.updateUser(payload);
    if (error) throw new Error(`${error.message}`);
  } catch (error) {
    console.log(error);
  }
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`${error.message}`);
  } catch (error) {
    console.log(error);
  }
  redirect("/");
}

// Create //

export async function createPlace(place: PlaceT & { day_id: string }) {
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

export async function createTrip(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const name = formData.get("name");

  try {
    if (typeof name !== "string") return;
    const { error } = await supabase.from("trips").insert({ name });
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

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

export async function createDay(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const rawFormData = {
    trip_id: formData.get("trip"),
  };

  try {
    const { data, error } = await supabase
      .from("days")
      .insert(rawFormData)
      .select("id")
      .limit(1)
      .single();
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/maps");
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Update //

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

export async function updateDayOrder(formData: FormData, order: string[]) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const rawFormData = {
    trip_id: formData.get("trip"),
  };

  try {
    const { error } = await supabase
      .from("trips")
      .update({ order_days: order })
      .eq("id", rawFormData.trip_id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

// Delete //

export async function deletePlace(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase.from("places").delete().eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTrip(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const id = formData.get("tripId");

  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw new Error(`Supabase error: ${error.message}`);
  revalidatePath("/trips");
}
