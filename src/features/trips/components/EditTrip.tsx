"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateTrip } from "@/utils/actions";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
};

export default function EditTrip({ open, setOpen, id }: Props) {
  async function handleSubmit(formData: FormData) {
    await updateTrip(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit New Trip</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          id="createTrip"
          className="flex flex-col items-center gap-2"
        >
          <input type="hidden" name="tripId" value={id} />
          <label className="flex w-full flex-col items-start gap-1">
            Name
            <Input type="text" name="name" placeholder="Palmdale" required />
          </label>
        </form>
        <DialogFooter>
          <Button form="createTrip">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
