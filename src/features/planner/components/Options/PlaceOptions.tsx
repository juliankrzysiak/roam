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
import { Place } from "@/types";
import { deletePlaces } from "@/utils/actions/crud/delete";
import { updateName } from "@/utils/actions/crud/update";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { SetStateAction, useAtom } from "jotai";
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
            <DropdownMenuItem>
              <span>Edit Travel</span>
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
