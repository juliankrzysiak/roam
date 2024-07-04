"use client";

import { DatePicker } from "@/components/general/DatePicker";
import { TimePicker } from "@/features/map/components/MapControls";
import PlaceCard from "@/features/planner/components/PlaceCard";
import { isPlannerVisibleAtom } from "@/lib/atom";
import { Day } from "@/types";
import { checkSameArr, mapId } from "@/utils";
import { updatePlaceOrder } from "@/utils/actions/crud/update";
import clsx from "clsx";
import { Reorder } from "framer-motion";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { DateRange } from "react-day-picker";

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
  const isVisible = useAtomValue(isPlannerVisibleAtom);
  const [places, setPlaces] = useState(day.places);

  function handleDragEnd() {
    const [orderOriginalPlaces, orderPlaces] = [day.places, places].map(mapId);
    const isSameArr = checkSameArr(orderOriginalPlaces, orderPlaces);

    if (!isSameArr) updatePlaceOrder(orderPlaces, day.id);
  }

  return (
    <section
      className={clsx(
        "absolute right-0 top-0 z-10 flex h-full w-full flex-col border-r-2 border-emerald-600 bg-slate-100 px-4 py-2 sm:static sm:max-w-xs",
        !isVisible && "hidden opacity-0",
      )}
    >
      <div className="sticky top-0 border-b-2 border-slate-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">{tripName}</h2>
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
          values={places}
          onReorder={setPlaces}
          layoutScroll
          className="flex h-full flex-col gap-4"
        >
          {places.map((place, i, arr) => {
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
    </section>
  );
}
