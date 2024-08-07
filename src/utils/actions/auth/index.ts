"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
