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
import { movePlace, updateName } from "@/utils/actions/crud/update";
import { formatInTimeZone } from "date-fns-tz";
import { SetStateAction } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { useParams } from "next/navigation";
import { Dispatch, useState } from "react";

type Props = {
  id: string;
  name: string;
  date: Date;
  timezone: string;
  dateRange: DateRange;
};

export default function PlaceOptions({
  id,
  name,
  date,
  timezone,
  dateRange,
}: Props) {
  const [isNameFormOpen, setIsNameFormOpen] = useState(false);
  const [isPlaceFormOpen, setIsPlaceFormOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger aria-label="Open options" className="h-fit">
          <EllipsisVertical size={18} className="h-fit text-slate-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="cursor-pointer">
          <DropdownMenuItem onClick={() => setIsNameFormOpen(true)}>
            Edit Name
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setIsPlaceFormOpen(true)}>
            Move Place
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <EditNameForm
        id={id}
        name={name}
        open={isNameFormOpen}
        setOpen={setIsNameFormOpen}
      />
      <MovePlaceForm
        id={id}
        date={date}
        timezone={timezone}
        dateRange={dateRange}
        open={isPlaceFormOpen}
        setOpen={setIsPlaceFormOpen}
      />
    </>
  );
}

type State = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type EditNameFormProps = Pick<Props, "id" | "name"> & State;

function EditNameForm({ id, name, open, setOpen }: EditNameFormProps) {
  async function handleSubmit(formData: FormData) {
    await updateName(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Name</DialogTitle>
        </DialogHeader>
        <form id="editNameForm" action={handleSubmit}>
          <input
            className="w-full rounded-md border border-slate-500 px-1"
            name="name"
            type="text"
            min={1}
            max={75}
            defaultValue={name}
            autoFocus
          />
          <input name="id" type="hidden" defaultValue={id}></input>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" form="editNameForm">
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const dateFormat = "yyyy-MM-dd";

type MovePlaceFormProps = Omit<Props, "name"> & State;

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
