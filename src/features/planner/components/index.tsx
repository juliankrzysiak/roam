import { SetStateAction, useState } from "react";
import { PlaceT } from "@/types";
import Place from "./Place";

interface Props {
  places: PlaceT[];
  setPlaces: React.Dispatch<SetStateAction<PlaceT[]>>;
}

export default function Planner({ places, setPlaces }: Props) {
  const [startTime, setStarttime] = useState("");

  let prev = startTime;
  let endTime = "0";

  return (
    <section className="absolute inset-4 left-10 top-1/2 h-5/6 w-4/12  -translate-y-1/2 rounded-xl border-4 border-emerald-600 bg-gray-100 shadow-lg ">
      <div className="h-20 border-4 border-b"></div>
      <label className="flex w-fit flex-col">
        Start time
        <input
          type="time"
          value={startTime}
          onChange={(event) => setStarttime(event.target.value)}
        />
      </label>
      {places.map((place, i, arr) => {
        const arrival = prev;
        const departure = prev + (place.duration ?? 0);
        prev = departure;
        if (i === arr.length - 1) endTime = departure;
        return (
          <Place
            key={place.id}
            {...place}
            arrival={arrival}
            departure={departure}
          />
        );
      })}
      <span className="flex w-fit flex-col">End Time {endTime}</span>
    </section>
  );
}
