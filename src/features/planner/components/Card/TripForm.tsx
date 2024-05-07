import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertTime } from "@/utils";
import { updateTripDuration } from "@/utils/actions/crud/update";

type Props = {
  placeId: string;
  tripDuration: number;
};

export default function TripForm({ placeId, tripDuration }: Props) {
  const { hours, minutes } = convertTime({ minutes: tripDuration });

  return (
    <form className="flex items-end gap-2" action={updateTripDuration}>
      <label className="flex">
        <Input
          className="px-1"
          name="hours"
          type="number"
          min="0"
          max="12"
          defaultValue={hours}
        />
        :
        <Input
          className="px-1"
          name="minutes"
          type="number"
          min="0"
          max="59"
          defaultValue={minutes}
        />
      </label>
      <input type="hidden" name="id" defaultValue={placeId} />
      <Button>Submit</Button>
    </form>
  );
}
