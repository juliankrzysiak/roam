"use client";

import { Button } from "@/components/ui/button";
import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { useSetAtom } from "jotai";

export default function SignUpButton() {
  const setOpen = useSetAtom(isSignUpFormVisibleAtom);

  return (
    <Button
      className="h-full w-full max-w-lg bg-emerald-800  py-2 text-2xl text-slate-100"
      onClick={() => setOpen(true)}
    >
      Start planning today
    </Button>
  );
}
