import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

type Props = {
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
};

export default function PlannerOptions({
  handleSelectAll,
  handleDeselectAll,
}: Props) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label="Open options">
        <EllipsisVertical size={18} className="text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSelectAll}>
          <span>Select All</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleDeselectAll}
        >
          <span>Deselect All</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
