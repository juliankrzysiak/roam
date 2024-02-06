import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTrip } from "@/utils/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TripForm() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Add Trip</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
        </DialogHeader>
        <form action={createTrip} className="flex flex-col items-center gap-2">
          <label className="flex w-full flex-col items-start gap-1">
            Name
            <Input type="text" name="name" placeholder="Palmdale" />
          </label>
        </form>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
