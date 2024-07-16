import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import TripOptions from "./TripOptions";
import { format } from "date-fns";
import { DateRange } from "@/types";

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
    <Card className="relative flex flex-col items-center justify-between">
      <TripOptions id={id} name={name} dateRange={dateRange} />
      <CardHeader>
        <CardTitle className="w-fit">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{range}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild>
          <Link href={`/${id}`}>Go To Schedule</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
