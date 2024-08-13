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
import { DateRange, Day } from "@/types";
import { movePlaces } from "@/utils/actions/crud/update";
import { formatInTimeZone } from "date-fns-tz";
import { SetStateAction } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

type Props = {
  day: Day;
  dateRange: DateRange;
};

export default function PlannerOptions({ day, dateRange }: Props) {
  const [openPlaces, setOpenPlaces] = useState(false);
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger aria-label="Open options">
          <EllipsisVertical size={18} className="text-slate-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenPlaces(true)}
          >
            <span>Move All Places</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MovePlacesForm
        dayId={day.id}
        date={day.date}
        timezone={day.timezone}
        dateRange={dateRange}
        open={openPlaces}
        setOpen={setOpenPlaces}
      />
    </>
  );
}

type MovePlacesFormProps = {
  dayId: string;
  date: Date;
  timezone: string;
  dateRange: DateRange;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

const dateFormat = "yyyy-MM-dd";

function MovePlacesForm({
  dayId,
  date,
  timezone,
  dateRange,
  open,
  setOpen,
}: MovePlacesFormProps) {
  const { tripId } = useParams<{ tripId: string }>();
  const [dateString, setDateString] = useState(
    formatInTimeZone(date, timezone, dateFormat),
  );
  const minDateString = formatInTimeZone(dateRange.from, timezone, dateFormat);
  const maxDateString = formatInTimeZone(dateRange.to, timezone, dateFormat);

  async function handleSubmit() {
    await movePlaces(tripId, dayId, dateString);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
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
          <input name="dayId" type="hidden" defaultValue={dayId} />
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
