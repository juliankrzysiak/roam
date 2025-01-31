"use client";

import { Button } from "@/components/ui/button";
import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { useSetAtom } from "jotai";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function SignUpButton({ text, ...props }: Props) {
  const setOpen = useSetAtom(isSignUpFormVisibleAtom);

  return (
    <Button {...props} onClick={() => setOpen(true)}>
      {text}
    </Button>
  );
}
