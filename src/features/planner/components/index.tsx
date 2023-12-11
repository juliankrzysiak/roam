import { PlaceT } from "@/types";
import { add, format, parse } from "date-fns";
import { SetStateAction, useState } from "react";
import Place from "./Place";

interface Props {
  places: PlaceT[];
  setPlaces: React.Dispatch<SetStateAction<PlaceT[]>>;
}

export default function Planner({ places, setPlaces }: Props) {
  const [startTime, setStartTime] = useState("08:00");
  let prev = parse(startTime, "HH:mm", new Date());
  let endTime;

  return (
    <section className="absolute inset-4 left-10 top-1/2 h-5/6 w-4/12  -translate-y-1/2 rounded-xl border-4 border-emerald-600 bg-gray-100 shadow-lg ">
      <div className="h-20 border-4 border-b"></div>
      <label className="flex w-fit flex-col">
        Start time
        <input
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
        />
      </label>
      {places.map((place, i, arr) => {
        const arrival = prev;
        const hours = place.duration.hours;
        const minutes = place.duration.minutes;
        const departure = add(arrival, { hours, minutes });
        prev = departure;
        if (i === arr.length - 1) endTime = format(departure, "HH:mm a");
        return (
          <Place
            key={place.id}
            place={place}
            arrival={arrival}
            departure={departure}
            places={places}
            setPlaces={setPlaces}
          />
        );
      })}
      <span className="flex w-fit flex-col">End Time {endTime ?? 0}</span>
    </section>
  );
}
