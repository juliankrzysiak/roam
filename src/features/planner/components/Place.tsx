import { PlaceT } from "@/types";
import { updateDuration } from "@/utils/actions";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Reorder } from "framer-motion";

type Props = {
  place: PlaceT;
  arrival: Date;
  departure: Date;
  handleDragEnd: () => void;
};
const timeFormat = "HH:mm a";

export default function Place({
  place,
  arrival,
  departure,
  handleDragEnd,
}: Props) {
  return (
    <Reorder.Item value={place} id={place.id} onDragEnd={handleDragEnd}>
      <div className="my-4 flex">
        <div>
          <div>Arrival {format(arrival, timeFormat)}</div>
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
          <div>Departure {format(departure, timeFormat)}</div>
        </div>
        <div className="flex flex-col">
          <h1>{place.name}</h1>
          <h2>{place.category}</h2>
        </div>
      </div>
    </Reorder.Item>
  );
}
