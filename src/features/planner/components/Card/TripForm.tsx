import { Trip } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  tripInfo: Trip | undefined;
};

export default function TripForm({ tripInfo }: Props) {
  if (!tripInfo) return;

  return (
    <form className="flex items-end gap-2">
      <label>
        Trip Duration
        <Input className="px-1" type="number" min={0} max={3600} step={5} />
      </label>
      <Button>Submit</Button>
    </form>
    // <div>
    //   <span>Duration: {tripInfo.duration} minutes</span>
    //   <span>Distance: {tripInfo.distance} miles</span>
    // </div>
  );
}
