import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceT } from "@/types";
import { updateDuration } from "@/utils/actions/crud/update";

type Props = {
  place: PlaceT;
};

export default function PlaceForm({ place }: Props) {
  return (
    <form className="flex items-end gap-2" action={updateDuration}>
      <label>
        Place Duration
        <Input
          className="px-1"
          type="number"
          name="duration"
          min={0}
          max={3600}
          step={5}
          defaultValue={place.duration}
        />
      </label>
      <input type="hidden" name="id" defaultValue={place.id} />
      <Button>Submit</Button>
    </form>
  );
}
