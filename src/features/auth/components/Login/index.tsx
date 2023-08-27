"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import { useState } from "react";

export default function Login() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-2xl font-semibold">Sign In</DialogTrigger>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Log in to your account.
          </DialogTitle>
        </DialogHeader>
        <LoginForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
