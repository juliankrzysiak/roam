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
import { IsSharedContext } from "@/context/IsSharedContext";
import { insertBeforeIdAtom } from "@/lib/atom";
import { Place } from "@/types";
import { deletePlaces } from "@/utils/actions/crud/delete";
import { updateName } from "@/utils/actions/crud/update";
import { SetStateAction, useAtom, useSetAtom } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { Dispatch, useContext, useState } from "react";

type Props = {
  id: string;
  name: string;
  dayId: string;
  places: Place[];
};

export default function PlaceOptions({ id, dayId, name, places }: Props) {
  const isShared = useContext(IsSharedContext);
  const [insertBeforeId, setInsertBeforeId] = useAtom(insertBeforeIdAtom);
  const [isNameFormOpen, setIsNameFormOpen] = useState(false);

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
          className="h-fit"
          disabled={isShared}
        >
          <EllipsisVertical
            size={18}
            className="h-fit text-slate-500"
            aria-label="Options for this place."
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="cursor-pointer">
          <DropdownMenuItem onClick={handleInsertBefore}>
            Toggle Insert Before
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsNameFormOpen(true)}>
            Edit Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeletePlace}>
            Delete place
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditNameForm
        id={id}
        name={name}
        open={isNameFormOpen}
        setOpen={setIsNameFormOpen}
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
