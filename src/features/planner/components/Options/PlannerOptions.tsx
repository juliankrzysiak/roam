import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

type Props = {
  handleSelectAll: () => void;
};

export default function PlannerOptions({ handleSelectAll }: Props) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label="Open options">
        <EllipsisVertical size={18} className="text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSelectAll}>
          <span>Select All</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
