import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceT } from "@/types";
import { updateDuration } from "@/utils/actions/crud/update";
import { add, format } from "date-fns";
import { useState } from "react";

const timeFormat = "HH:mm a";

type Props = {
  arrival: Date;
  duration: number;
  placeId: string;
};

export default function PlaceTimes({ arrival, duration, placeId }: Props) {
  const [placeDuration, setDuration] = useState(duration);
  const departure = add(arrival, { minutes: placeDuration });

  return (
    <form className="flex justify-between gap-2" action={updateDuration}>
      <p className="text-center">{format(arrival, timeFormat)}</p>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col items-center gap-2">
          <Input
            className="max-w-xs px-1"
            name="duration"
            type="number"
            defaultValue={placeDuration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>
        <input type="hidden" name="id" defaultValue={placeId} />
        <Button type="submit">Submit</Button>
      </div>
      <p className="text-center">{format(departure, timeFormat)}</p>
    </form>
  );
}
