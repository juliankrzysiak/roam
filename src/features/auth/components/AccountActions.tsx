"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import LoginForm from "./Forms/LoginForm";
import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { useSetAtom } from "jotai";

export default function AccountActions() {
  return (
    <div className="flex gap-4 text-slate-100">
      <Login />
      <Signup />
    </div>
  );
}

function Login() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>login</DialogTrigger>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Log in to your account</DialogTitle>
        </DialogHeader>
        <LoginForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function Signup() {
  const setOpen = useSetAtom(isSignUpFormVisibleAtom);

  return <button onClick={() => setOpen(true)}>sign up</button>;
}
