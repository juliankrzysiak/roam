"use client";

import { Button } from "@/components/ui/button";
import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function SignUpButton() {
  const router = useRouter();
  const setOpen = useSetAtom(isSignUpFormVisibleAtom);

  function handleClick() {
    router.push("/");
    setOpen(true);
  }

  return (
    <Button className="mt-8" variant="outline" onClick={handleClick}>
      Sign Up
    </Button>
  );
}
