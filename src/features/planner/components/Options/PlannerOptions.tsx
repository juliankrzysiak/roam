import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange, Day } from "@/types";
import { EllipsisVertical } from "lucide-react";

type Props = {
  day: Day;
  dateRange: DateRange;
};

export default function PlannerOptions({ day, dateRange }: Props) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label="Open options">
        <EllipsisVertical size={18} className="text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">
          <span>Select All</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
