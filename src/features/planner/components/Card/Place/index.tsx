import { PlaceT, Time } from "@/types";
import { updateDuration } from "@/utils/actions";
import { format } from "date-fns";

type Props = {
  place: PlaceT;
  time: Time;
};
const timeFormat = "HH:mm a";

export default function Place({ place, time }: Props) {
  return (
    <div className="my-4 flex">
      <div>
        <div>Arrival {format(time.arrival, timeFormat)}</div>
        <form className="flex flex-col" action={updateDuration}>
          <label>
            Minutes
            <input
              type="number"
              name="duration"
              min={0}
              step={5}
              defaultValue={place.duration}
            />
            <input type="hidden" name="id" defaultValue={place.id} />
          </label>
          <button>Submit</button>
        </form>
        <div>Departure {format(time.departure, timeFormat)}</div>
      </div>
      <div className="flex flex-col">
        <h1>{place.name}</h1>
        <h2>{place.category}</h2>
      </div>
    </div>
  );
}
