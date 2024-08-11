import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { formatInTimeZone } from "date-fns-tz";
import { SetStateAction } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

type Props = {
  date: Date;
  timezone: string;
  dateRange: DateRange;
};

export default function PlannerOptions({ date, timezone, dateRange }: Props) {
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
        date={date}
        timezone={timezone}
        dateRange={dateRange}
        open={openPlaces}
        setOpen={setOpenPlaces}
      />
    </>
  );
}

type MovePlacesFormProps = {
  date: Date;
  timezone: string;
  dateRange: DateRange;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

function MovePlacesForm({
  date,
  timezone,
  dateRange,
  open,
  setOpen,
}: MovePlacesFormProps) {
  const dateString = formatInTimeZone(date, timezone, "yyyy-MM-dd");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        <form>
          <input type="date" defaultValue={dateString} />
          <DialogFooter>
            <Button>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
