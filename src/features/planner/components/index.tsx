"use client";

import { DayInfo, PlaceInfo, PlaceT } from "@/types";
import { reorderPlaces } from "@/utils";
import { deleteDay } from "@/utils/actions/crud/delete";
import { updateStartTime } from "@/utils/actions/crud/update";
import { add, format, parse } from "date-fns";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import Card from "./Card";
import NavigateDays from "./NavigateDays";

type Props = {
  places: PlaceT[];
  dayInfo: DayInfo;
  tripId: number;
};

export default function Planner({ places, dayInfo, tripId }: Props) {
  // TODO: Optimistic updates can be used here
  const startTime = parse(dayInfo.startTime, "HH:mm:ss", new Date());
  const [items, setItems] = useState(() => calcItinerary(places));
  const endTime = format(items.at(-1)?.departure ?? startTime, "h:mm a");

  function calcItinerary(places: PlaceT[]): PlaceInfo[] {
    let arrival = startTime;
    let departure = null;

    const calculatedPlaces = places.map((place) => {
      const { placeDuration, tripDuration } = place;
      departure = add(arrival, { minutes: placeDuration });
      const placeInfo = { arrival, departure, placeDuration };
      const updatedPlace = { ...place, ...placeInfo };
      arrival = add(departure, { minutes: tripDuration });
      return updatedPlace;
    });

    return calculatedPlaces;
  }

  function handleDragEnd() {
    reorderPlaces(places, items, dayInfo.currentDay);
  }

  // Code Smell
  useEffect(() => {
    setItems(calcItinerary(places));
  }, [places]);

  return (
    <section className="flex w-full max-w-xs flex-col overflow-scroll border-2 border-emerald-600 bg-gray-100 p-4 shadow-lg ">
      <NavigateDays dayInfo={dayInfo} tripId={tripId} />
      <div className="flex items-center justify-around">
        <form action={updateStartTime} className="flex flex-col text-center">
          <label className="flex w-fit flex-col">
            Start time
            <input
              type="time"
              name="startTime"
              defaultValue={dayInfo.startTime}
            />
            <input type="hidden" name="id" defaultValue={dayInfo.currentDay} />
            <button>Submit</button>
          </label>
        </form>
        <div className="flex flex-col text-center">
          <p>End Time</p>
          <p>{endTime}</p>
        </div>
      </div>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="flex h-full flex-col gap-4"
      >
        {items.map((place, i, arr) => {
          const isLast = i === arr.length - 1;
          return (
            <Card
              key={place.id}
              place={place}
              handleDragEnd={handleDragEnd}
              last={isLast}
            />
          );
        })}
      </Reorder.Group>
      <form action={deleteDay} className="self-center">
        <input type="hidden" name="dayId" defaultValue={dayInfo.currentDay} />
        <button>delete</button>
      </form>
    </section>
  );
}
