"use client";

import { Day, PlaceInfo, Place } from "@/types";
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
import NavigateDays from "./NavigateDays";
import StartTime from "./StartTime";
import { useAtomValue } from "jotai";
import { isPlannerVisibleAtom } from "@/lib/atom";
import clsx from "clsx";
import { Car } from "lucide-react";
import { TimePicker } from "@/features/map/components/MapControls";
import { DatePicker } from "@/components/general/DatePicker";
import { DateRange } from "react-day-picker";
import PlaceCard from "@/features/planner/components/PlaceCard";

type PlannerProps = {
  day: Day;
  tripId: string;
  tripName: string;
  dateRange: DateRange;
};

export default function Planner({
  day,
  dateRange,
  tripId,
  tripName,
}: PlannerProps) {
  // TODO: Optimistic updates can be used here
  // FIX: make it a date then convert
  const isVisible = useAtomValue(isPlannerVisibleAtom);
  const startTime = parse(day.startTime, "HH:mm:ss", new Date());
  const [items, setItems] = useState(() => calcItinerary(day.places));
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
    reorderPlaces(day.places, items, day.id);
  }

  // Code Smell
  useEffect(() => {
    setItems(calcItinerary(day.places));
  }, [day.places]);

  return (
    <section
      className={clsx(
        "absolute right-0 top-0 z-10 flex h-full w-full flex-col overflow-scroll border-r-2 border-emerald-600 bg-slate-100 px-4 py-2 sm:static sm:max-w-xs",
        !isVisible && "hidden opacity-0",
      )}
    >
      <div className="sticky top-0 border-b-2 border-slate-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">{tripName}</h2>
          {/* <span className="flex gap-2">
            <Car /> 5:30{" "}
          </span> */}
          <DatePicker
            initialDate={day.date}
            dateRange={dateRange}
            tripId={tripId}
          />
        </div>
        <TimePicker day={day} />
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
              <PlaceCard
                key={place.id}
                place={place}
                handleDragEnd={handleDragEnd}
                last={isLast}
              />
            );
          })}
        </Reorder.Group>
      </div>
      {/* <form
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
      </form> */}
    </section>
  );
}
