"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createClientJS } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { deleteCookie } from "../cookies";

type AccountArgs = {
  name: string;
  email: string;
  emailChanged: boolean;
};

export async function updateAccount({
  name,
  email,
  emailChanged,
}: AccountArgs) {
  const supabase = createClient();

  const payload: { [k: string]: any } = {
    data: { name },
  };

  if (emailChanged) {
    payload.email = email;
  }

  const { error } = await supabase.auth.updateUser(payload);
  if (error) {
    console.log(error);
    return error.message;
  }
}

export async function updatePassword(password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.log(error);
    return error.message;
  }
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  else redirect("/");
}

export async function deleteData() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  try {
    if (!userId) throw new Error();
    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("user_id", userId);
    if (error) throw new Error();
    deleteCookie("tripId");
    return { description: "Your data has been deleted." };
  } catch (error) {
    console.log(error);
    return {
      title: "Oops, something went wrong.",
      description: "There was a problem with your request.",
    };
  }
}

// I made two separate clients because I can only delete a user using the JS client
// Also using two means I can log out and stil delete the user
export async function deleteAccount() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  try {
    if (!userId) throw new Error("Could not find user id.");
    const supabaseJS = createClientJS(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_KEY as string,
    );
    await deleteData();
    await supabase.auth.signOut();
    const { error } = await supabaseJS.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
    deleteCookie("tripId");
    return { description: "Your account and data have been deleted." };
  } catch (error) {
    console.log(error);
    return {
      title: "Oops, something went wrong",
      description: "There was a problem with your request.",
    };
  }
}
