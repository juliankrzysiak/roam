import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "@/types";
import { movePlace } from "@/utils/actions/crud/update";
import { formatInTimeZone } from "date-fns-tz";
import { SetStateAction } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  date: Date;
  timezone: string;
  dateRange: DateRange;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function PlaceOptions({
  id,
  date,
  timezone,
  dateRange,
  setOpen,
}: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger aria-label="Open options" className="h-fit">
          <EllipsisVertical size={18} className="h-fit text-slate-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <span>Edit Name</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsFormOpen(true)}>
            <span>Move Place</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MovePlaceForm
        id={id}
        date={date}
        timezone={timezone}
        dateRange={dateRange}
        open={isFormOpen}
        setOpen={setIsFormOpen}
      />
    </>
  );
}
const dateFormat = "yyyy-MM-dd";

type MovePlaceFormProps = Props & { open: boolean };

function MovePlaceForm({
  id,
  date,
  timezone,
  dateRange,
  open,
  setOpen,
}: MovePlaceFormProps) {
  const { tripId } = useParams<{ tripId: string }>();
  const initialDateString = formatInTimeZone(date, timezone, dateFormat);
  const [dateString, setDateString] = useState(initialDateString);
  const minDateString = formatInTimeZone(dateRange.from, timezone, dateFormat);
  const maxDateString = formatInTimeZone(dateRange.to, timezone, dateFormat);

  async function handleSubmit() {
    if (dateString === initialDateString) setOpen(false);
    else {
      await movePlace(tripId, id, dateString);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Place To New Date</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <input
            name="date"
            type="date"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            min={minDateString}
            max={maxDateString}
          />
          <input name="tripId" type="hidden" defaultValue={tripId} />
          <input name="placeId" type="hidden" defaultValue={id} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
