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
import { updateName } from "@/utils/actions/crud/update";
import { SetStateAction } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { Dispatch, useState } from "react";

type Props = {
  id: string;
  name: string;
};

export default function PlaceOptions({
  id,
  name,
}: Props) {
  const [isNameFormOpen, setIsNameFormOpen] = useState(false);

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

type EditNameFormProps = Props & State;

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
