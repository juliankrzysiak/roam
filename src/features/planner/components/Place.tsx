import { PlaceT } from "@/types";
import { format } from "date-fns";
import { ChangeEvent, SetStateAction } from "react";

interface Time {
  place: PlaceT;
  arrival: Date;
  departure: Date;
  places: PlaceT[];
  setPlaces: React.Dispatch<SetStateAction<PlaceT[]>>;
}

export default function Place({
  place,
  arrival,
  departure,
  places,
  setPlaces,
}: Time) {
  const timeFormat = "HH:mm a";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const duration = Number(event?.target.value);
    const arr = places.map((e) =>
      e.id === place.id ? { ...place, duration } : e,
    );
    setPlaces(arr);
  }
  return (
    <div className="my-4 flex ">
      <div>
        <div>Arrival {format(arrival, timeFormat)}</div>
        <label className="flex">
          Duration
          <input
            type="number"
            defaultValue={place.duration}
            step={5}
            onChange={handleChange}
          />
        </label>
        <div>Departure {format(departure, timeFormat)}</div>
      </div>
      <h1>{place.name}</h1>
    </div>
  );
}
