"use client";

import { DayInfo, PlaceT } from "@/types";
import { parseOrder } from "@/utils";
import { updatePlaceOrder, updateStartTime } from "@/utils/actions/crud/update";
import { add, format, parse } from "date-fns";
import { Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "./Card";
import NavigateDays from "./NavigateDays";

type Props = {
  places: PlaceT[];
  dayInfo: DayInfo;
  tripId: number;
};

export default function Planner({ places, dayInfo, tripId }: Props) {
  const router = useRouter();
  let startTime = parse(dayInfo.startTime ?? "08:00", "HH:mm", new Date());
  const [items, setItems] = useState(() => calcItinerary(places));

  function calcItinerary(places: PlaceT[]) {
    let arrival = startTime;
    let departure = null;

    const calculatedPlaces = places.map((place) => {
      departure = addDuration(arrival, place.duration);
      const updatedPlace = { ...place, arrival, departure };
      arrival = addDuration(departure, place.tripInfo?.duration ?? 0);
      return updatedPlace;
    });

    return calculatedPlaces;

    // TODO: Add this to lib
    function addDuration(arrival: Date, duration: number): Date {
      return add(arrival, { minutes: duration });
    }
  }

  // TODO: Why do i have this here again...
  // useEffect(() => {
  //   setItems(calcItinerary(places));
  // }, [places]);

  return (
    <section className="absolute inset-1 left-10 top-1/2 h-5/6 w-4/12 -translate-y-1/2 overflow-scroll rounded-xl border-4 border-emerald-600 bg-gray-100 p-4 shadow-lg ">
      <NavigateDays dayInfo={dayInfo} tripId={tripId} />
      <div className="flex items-center justify-around">
        <form action={updateStartTime} className="flex flex-col text-center">
          <label className="flex w-fit flex-col">
            Start time
            <input
              type="time"
              name="startTime"
              defaultValue={format(startTime, "HH:mm")}
            />
            <button>Submit</button>
          </label>
        </form>
        <div className="flex flex-col text-center">
          <p>End Time</p>
          <p>{format(items.at(-1)?.departure, "HH:mm") ?? 0}</p>
        </div>
      </div>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="flex flex-col gap-4"
      >
        {items.map((place) => {
          return (
            <Card
              key={place.id}
              place={place}
              arrival={place.arrival}
              duration={place.duration}
              tripInfo={place.tripInfo}
              handleDragEnd={reorderPlaces}
            />
          );
        })}
        {/* {items.map((place, i, arr) => {
          const arrival = startTime;
          const departure = add(arrival, { minutes: place.duration });
          startTime = add(departure, {
            minutes: place.tripInfo?.duration ?? 0,
          });
          if (i === arr.length - 1) endTime = format(departure, "HH:mm");
          return (
            <Card
              key={place.id}
              place={place}
              arrival={arrival}
              duration={place.duration}
              tripInfo={place.tripInfo}
              handleDragEnd={reorderPlaces}
            />
          );
        })} */}
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
