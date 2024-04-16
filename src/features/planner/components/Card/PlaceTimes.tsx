import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Duration, PlaceT } from "@/types";
import { updateDuration } from "@/utils/actions/crud/update";
import { add, format } from "date-fns";
import { useState } from "react";

const timeFormat = "HH:mm a";

type Props = {
  arrival: Date;
  duration: Duration;
  placeId: string;
};

export default function PlaceTimes({ arrival, duration, placeId }: Props) {
  const [hourDuration, setHourDuration] = useState(duration.hours);
  const [minuteDuration, setMinuteDuration] = useState(duration.minutes);
  const departure = add(arrival, {
    hours: hourDuration,
    minutes: minuteDuration,
  });

  return (
    <form className="flex justify-between gap-2" action={updateDuration}>
      <p className="text-center">{format(arrival, timeFormat)}</p>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <Input
            className="max-w-xs px-1"
            name="hours"
            type="number"
            min="0"
            max="12"
            defaultValue={hourDuration}
            onChange={(e) => setHourDuration(Number(e.target.value))}
          />
          :
          <Input
            className="max-w-xs px-1"
            name="minutes"
            type="number"
            min="0"
            max="59"
            defaultValue={minuteDuration}
            onChange={(e) => setMinuteDuration(Number(e.target.value))}
          />
        </label>
        <input type="hidden" name="id" defaultValue={placeId} />
        <Button type="submit">Submit</Button>
      </div>
      <p className="text-center">{format(departure, timeFormat)}</p>
    </form>
  );
}
