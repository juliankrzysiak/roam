"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Header() {
  const loginModal = useRef<HTMLDialogElement>(null);
  return (
    <>
      <header className="flex justify-between bg-emerald-600 px-4 py-2 text-gray-100">
        <h2 className="text-4xl font-bold">Journey</h2>
        <Dialog>
          <DialogTrigger>Login</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </header>
    </>
  );
}
