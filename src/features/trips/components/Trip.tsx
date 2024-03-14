import { Button } from "@/components/ui/button";
import { Trip } from "@/types";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TripOptions from "./TripOptions";

type Props = {
  id: number;
  name: string;
};

export default async function Trip({ id, name }: Props) {
  return (
    <Card className="relative flex flex-col items-center justify-between">
      <TripOptions id={id} />
      <CardHeader>
        <CardTitle className="w-fit">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Date</p>
        <p>Miles</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/map/${id}`}>Go To Schedule</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
