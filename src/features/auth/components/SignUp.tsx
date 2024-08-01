"use client";

import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { useSetAtom } from "jotai";

export default function Signup() {
  const setOpen = useSetAtom(isSignUpFormVisibleAtom);

  return <button onClick={() => setOpen(true)}>sign up</button>;
}
