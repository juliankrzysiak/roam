import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";

type Props = {
  children: React.ReactNode;
  handleSubmit: () => Promise<void>;
};

export default function ConfirmDialog({ children, handleSubmit }: Props) {
  const [open, setOpen] = useState(false);

  async function handleConfirmDelete() {
    await handleSubmit();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <form className="flex justify-between" action={handleConfirmDelete}>
          <Button variant="destructive">Delete</Button>
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Go Back
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
