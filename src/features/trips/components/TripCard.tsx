import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import TripOptions from "./TripOptions";
import { format } from "date-fns";

type Props = {
  id: number;
  name: string;
  dateRange: DateRange;
};

const dateFormat = "MMM dd";

export default async function TripCard({ id, name, dateRange }: Props) {
  const range = `${format(dateRange.from, dateFormat)} - ${format(
    dateRange.to,
    dateFormat,
  )}`;

  return (
    <Card className="relative flex flex-col items-center justify-between">
      <TripOptions id={id} name={name} dateRange={dateRange} />
      <CardHeader>
        <CardTitle className="w-fit">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Days: {range}</p>
        {/* <p>Date</p> */}
        {/* <p>Miles</p> */}
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/${id}`}>Go To Schedule</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
