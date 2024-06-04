"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteTrip } from "@/utils/actions/crud/delete";
import { DialogDescription } from "@radix-ui/react-dialog";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
};

export default function DeleteTrip({ open, setOpen, id }: Props) {
  async function handleSubmit(formData: FormData) {
    await deleteTrip(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>
        <form
          action={handleSubmit}
          id="createTrip"
          className="flex justify-center gap-4"
        >
          <input type="hidden" name="tripId" value={id} />
          <Button type="submit" variant="destructive">
            Yes, Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            No, Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
