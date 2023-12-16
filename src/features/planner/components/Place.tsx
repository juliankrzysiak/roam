import { PlaceT } from "@/types";
import { format } from "date-fns";
import { ChangeEvent, SetStateAction, useState } from "react";

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

  function handleChange(e: ChangeEvent<HTMLFormElement>) {
    const hours = e.currentTarget.hours.value;
    const minutes = e.currentTarget.minutes.value;
    const arr = places.map((e) =>
      e.id === place.id ? { ...place, duration: { hours, minutes } } : e,
    );
    setPlaces(arr);
  }

  return (
    <div className="my-4 flex ">
      <div>
        <div>Arrival {format(arrival, timeFormat)}</div>
        <form className="flex flex-col" onChange={handleChange}>
          Duration
          <label>
            Hours
            <input type="number" name="hours" min={0} max={12} />
          </label>
          <label>
            Minutes
            <input type="number" name="minutes" min={0} step={5} max={55} />
          </label>
        </form>
        <div>Departure {format(departure, timeFormat)}</div>
      </div>
      <h1>{place.name}</h1>
    </div>
  );
}
