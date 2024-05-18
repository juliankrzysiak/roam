"use client";

import { DayInfo, PlaceInfo, Place } from "@/types";
import { reorderPlaces } from "@/utils";
import { deleteDay } from "@/utils/actions/crud/delete";
import {
  updateDay,
  updateDayOrder,
  updateStartTime,
} from "@/utils/actions/crud/update";
import { add, format, parse } from "date-fns";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import Card from "./Card";
import NavigateDays from "./NavigateDays";
import StartTime from "./StartTime";

type Props = {
  places: Place[];
  dayInfo: DayInfo;
  tripId: number;
};

export default function Planner({ places, dayInfo, tripId }: Props) {
  // TODO: Optimistic updates can be used here
  const startTime = parse(dayInfo.startTime, "HH:mm:ss", new Date());
  const [items, setItems] = useState(() => calcItinerary(places));
  const endTime = format(items.at(-1)?.departure ?? startTime, "h:mm a");

  // useMemo this, or just move it to server component
  function calcItinerary(places: Place[]): PlaceInfo[] {
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
    reorderPlaces(places, items, dayInfo.currentDayId);
  }

  // Code Smell
  useEffect(() => {
    setItems(calcItinerary(places));
  }, [places]);

  return (
    <section className="relative flex w-full max-w-xs flex-col overflow-scroll border-2 border-emerald-600 bg-gray-100 px-4 shadow-lg">
      <div className="sticky top-0 bg-inherit">
        <NavigateDays dayInfo={dayInfo} tripId={tripId} />
        <StartTime endTime={endTime} />
      </div>
      <div className="py-2">
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
      </div>
      <form
        action={async () => {
          if (dayInfo.indexCurrentDay >= dayInfo.orderDays.length - 1)
            await updateDay(dayInfo.indexCurrentDay - 1, tripId);
          const newOrder = dayInfo.orderDays.filter(
            (id) => id !== dayInfo.currentDayId,
          );
          await updateDayOrder(tripId, newOrder);
          await deleteDay(dayInfo.currentDayId);
        }}
        className="self-center "
      >
        <input type="hidden" name="tripId" defaultValue={tripId} />
        <input
          type="hidden"
          name="index"
          defaultValue={dayInfo.indexCurrentDay}
        />
        <input
          type="hidden"
          name="orderDays"
          defaultValue={dayInfo.orderDays}
        />
        <input type="hidden" name="dayId" defaultValue={dayInfo.currentDayId} />
        <button>delete day</button>
      </form>
    </section>
  );
}
