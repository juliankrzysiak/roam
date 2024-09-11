import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IsSharedContext } from "@/context/IsSharedContext";
import { EllipsisVertical } from "lucide-react";
import { useContext } from "react";

type Props = {
  handleSelectAll: () => void;
};

export default function PlannerOptions({ handleSelectAll }: Props) {
  const isShared = useContext(IsSharedContext);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label="Open options" disabled={isShared}>
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
