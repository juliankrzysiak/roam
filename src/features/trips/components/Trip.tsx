import { Button } from "@/components/ui/button";
import { Trip } from "@/types/supabase";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TripOptions from "./TripOptions";

type Props = Pick<Trip, "id" | "name">;

export default async function Trip({ id, name }: Props) {
  return (
    <Card className="relative flex flex-col items-center">
      <TripOptions />
      <CardHeader>
        <CardTitle className="w-fit">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Date</p>
        <p>Miles</p>
      </CardContent>
      <CardFooter>
        <Button>
          Schedule
          {/* <Link href={`/map/${id}`}>Schedule</Link> */}
        </Button>
      </CardFooter>
      {/* <form action={deleteTrip}>
        <input type="hidden" name="tripId" value={id} />
        <button>Delete</button>
      </form> */}
    </Card>
  );
}

// className =
//   "flex flex-col items-center gap-4 rounded-lg border bg-slate-100 p-4 shadow-lg";
