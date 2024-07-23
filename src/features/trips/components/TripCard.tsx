import { Button } from "@/components/ui/button";
import { DateRange } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import TripOptions from "./TripOptions";

type Props = {
  id: string;
  name: string;
  dateRange: DateRange;
};

const dateFormat = "MMM dd";

export default async function TripCard({ id, name, dateRange }: Props) {
  let range = `${format(dateRange.from, dateFormat)}`;
  if (dateRange.to) range += ` - ${format(dateRange.to, dateFormat)}`;

  return (
    <article className="relative flex flex-col items-center justify-between gap-2 rounded-lg bg-slate-100 p-4 ">
      <TripOptions id={id} name={name} dateRange={dateRange} />
      <h3 className="text-2xl font-semibold">{name}</h3>
      <p>{range}</p>
      <Button variant="default" size="sm" asChild className="mt-4 w-full">
        <Link href={`/${id}`}>Schedule</Link>
      </Button>
    </article>
  );
}
