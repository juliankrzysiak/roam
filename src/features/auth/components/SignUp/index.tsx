"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignUpForm from "./SignUpForm";
import { useAtom } from "jotai";
import { isSignUpFormVisibleAtom } from "@/lib/atom";

export default function SignUp() {
  const [open, setOpen] = useAtom(isSignUpFormVisibleAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-slate-100">sign up</DialogTrigger>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create a new account</DialogTitle>
        </DialogHeader>
        <SignUpForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
