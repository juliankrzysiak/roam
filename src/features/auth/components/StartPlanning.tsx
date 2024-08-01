"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignUpForm from "./Forms/SignUpForm";
import { useAtom } from "jotai";
import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const [open, setOpen] = useAtom(isSignUpFormVisibleAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild className="bg-emerald-800 py-6 text-lg xl:text-xl">
        <DialogTrigger>Start planning</DialogTrigger>
      </Button>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create a new account</DialogTitle>
        </DialogHeader>
        <SignUpForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
