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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { IsSharedContext } from "@/context/IsSharedContext";
import { insertBeforeIdAtom } from "@/lib/atom";
import { Place, Travel } from "@/types";
import { convertTime } from "@/utils";
import { deletePlaces, resetTravelInfo } from "@/utils/actions/crud/delete";
import { updateName, updateTravelInfo } from "@/utils/actions/crud/update";
import { DialogDescription } from "@radix-ui/react-dialog";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { SetStateAction, useAtom } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { Dispatch, useContext, useState } from "react";

type Props = {
  id: string;
  dayId: string;
  name: string;
  travel: Place["travel"];
  places: Place[];
};

export default function PlaceOptions({
  id,
  dayId,
  name,
  travel,
  places,
}: Props) {
  const isShared = useContext(IsSharedContext);
  const [insertBeforeId, setInsertBeforeId] = useAtom(insertBeforeIdAtom);
  const [isNameFormOpen, setIsNameFormOpen] = useState(false);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);

  function handleDeletePlace() {
    const placesToDelete = [id];
    deletePlaces({ placesToDelete, places, dayId });
  }

  function handleInsertBefore() {
    if (insertBeforeId === id) setInsertBeforeId(null);
    else setInsertBeforeId(id);
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label="Open options"
          className="h-fit pl-2"
          disabled={isShared}
        >
          <EllipsisVertical
            size={18}
            className=" text-slate-500"
            aria-label="Options for this place."
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="cursor-pointer">
          <DropdownMenuItem onClick={handleInsertBefore}>
            <span>Toggle Insert Before</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsNameFormOpen(true)}>
              <span>Edit Name</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsTripFormOpen(true)}
              disabled={!Boolean(travel)}
            >
              <span>Edit Travel Info</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Delete Place</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={handleDeletePlace}>
                  <span>Confirm Delete</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditNameForm
        id={id}
        name={name}
        open={isNameFormOpen}
        setOpen={setIsNameFormOpen}
      />
      {travel && (
        <EditTravelForm
          id={id}
          travel={travel}
          open={isTripFormOpen}
          setOpen={setIsTripFormOpen}
        />
      )}
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
          <Input name="name" type="text" min={1} max={75} defaultValue={name} />
          <input name="id" type="hidden" defaultValue={id} />
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

type EditTravelFormProps = Pick<Props, "id"> & { travel: Travel } & State;

function EditTravelForm({ id, travel, open, setOpen }: EditTravelFormProps) {
  const { minutes, hours } = convertTime({ minutes: travel.duration });

  async function handleSubmit(formData: FormData) {
    await updateTravelInfo(formData);
    setOpen(false);
  }

  async function handleReset(formData: FormData) {
    await resetTravelInfo(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Travel Information</DialogTitle>
          <DialogDescription>
            Manually change info if inaccurate
          </DialogDescription>
        </DialogHeader>
        <form
          id="editTripForm"
          action={handleSubmit}
          className="flex flex-col gap-2"
        >
          <label className="flex gap-2">
            <span className="font-medium">Duration</span>
            <div className="flex gap-1">
              <input
                aria-label="hours"
                className="w-8 rounded-md border border-slate-400 pl-1"
                name="hours"
                type="number"
                min="0"
                max="12"
                defaultValue={hours}
              />
              :
              <input
                aria-label="minutes"
                className="w-8 rounded-md border border-slate-400 pl-1"
                name="minutes"
                type="number"
                min="0"
                max="59"
                defaultValue={minutes}
              />
            </div>
          </label>
          <label className="flex items-center gap-2">
            <span className="font-medium">Distance</span>
            <input
              type="number"
              name="distance"
              min={0}
              max={1000}
              className="w-8 rounded-md border border-slate-400 pl-1"
              defaultValue={travel?.distance}
            />
            mi
          </label>
          <input type="hidden" name="id" defaultValue={id} />
        </form>
        <DialogFooter className="flex gap-2">
          <form action={handleReset}>
            <Button variant="outline">Reset to Default</Button>
            <input type="hidden" name="id" defaultValue={id} />
          </form>
          <Button type="submit" form="editTripForm">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
