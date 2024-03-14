"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.log(error);
    return error.message;
  }
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();
  if (error) console.log(error);
  redirect("/");
}
