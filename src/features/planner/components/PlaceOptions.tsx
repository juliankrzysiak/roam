import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SetStateAction } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { Dispatch } from "react";

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function PlaceOptions({ setOpen }: Props) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label="Open options">
        <EllipsisVertical size={18} className="text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span>Edit Name</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
