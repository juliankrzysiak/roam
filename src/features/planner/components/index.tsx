"use client";

import { DayInfo, PlaceInfo, PlaceT } from "@/types";
import { parseOrder } from "@/utils";
import { updatePlaceOrder, updateStartTime } from "@/utils/actions/crud/update";
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

  // Code Smell
  useEffect(() => {
    setItems(calcItinerary(places));
  }, [places]);

  return (
    <section className="w-full max-w-xs overflow-scroll border-2 border-emerald-600 bg-gray-100 p-4 shadow-lg ">
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
        className="flex flex-col gap-4"
      >
        {items.map((place, i, arr) => {
          const isLast = i === arr.length - 1;
          return (
            <Card
              key={place.id}
              place={place}
              handleDragEnd={reorderPlaces}
              last={isLast}
            />
          );
        })}
      </Reorder.Group>
    </section>
  );

  function reorderPlaces() {
    const oldOrder = parseOrder(places);
    const newOrder = parseOrder(items);

    function checkEqualArrays(arr1: string[], arr2: string[]) {
      return arr1.join("") === arr2.join("");
    }
    // Don't want to invoke a server action when dragging and dropping to the same position
    if (checkEqualArrays(oldOrder, newOrder)) return;
    updatePlaceOrder(newOrder, dayInfo.currentDay);
  }
}
