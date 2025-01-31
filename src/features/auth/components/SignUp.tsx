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
import Link from "next/link";

type Props = {
  isUser: boolean;
};

export default function SignUp({ isUser }: Props) {
  const [open, setOpen] = useAtom(isSignUpFormVisibleAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild className="bg-emerald-900 py-8 text-xl lg:text-2xl">
        {isUser ? (
          <Link href={"/trips"}>Start planning</Link>
        ) : (
          <DialogTrigger>Start planning</DialogTrigger>
        )}
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
