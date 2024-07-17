"use client";

import PlaceCard from "@/features/planner/components/PlaceCard";
import { isPlannerVisibleAtom } from "@/lib/atom";
import { Day } from "@/types";
import { checkSameArr, mapId } from "@/utils";
import { updatePlaceOrder, updateStartTime } from "@/utils/actions/crud/update";
import clsx from "clsx";
import { addMinutes, format, parse } from "date-fns";
import { Reorder } from "framer-motion";
import { useAtomValue } from "jotai";
import { Check, Moon, Sun, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

type PlannerProps = {
  day: Day;
  tripId: string;
  tripName: string;
  dateRange: DateRange;
  totalDuration: number;
};

export default function Planner({
  day,
  dateRange,
  tripId,
  tripName,
  totalDuration,
}: PlannerProps) {
  const isVisible = useAtomValue(isPlannerVisibleAtom);
  const [places, setPlaces] = useState(day.places);

  function handleDragEnd() {
    const [orderOriginalPlaces, orderPlaces] = [day.places, places].map(mapId);
    const isSameArr = checkSameArr(orderOriginalPlaces, orderPlaces);
    if (!isSameArr) updatePlaceOrder(orderPlaces, day.id);
  }

  useEffect(() => {
    setPlaces(day.places);
  }, [day.places]);

  return (
    <section
      className={clsx(
        "absolute left-0 top-0 z-10 flex h-full w-full flex-col border-r-2 border-emerald-600 bg-slate-100 sm:relative sm:max-w-xs",
        !isVisible && "hidden opacity-0",
      )}
    >
      <div className="sticky top-0 m-2 flex flex-col items-center rounded-md border-2 border-slate-400 shadow-md">
        <h2 className="text-center text-xl tracking-wide">{tripName}</h2>
        <hr className="w-full border-slate-400 " />
        <TimePicker day={day} totalDuration={totalDuration} />
      </div>
      <div className="flex-1 overflow-auto">
        <Reorder.Group
          axis="y"
          values={places}
          onReorder={setPlaces}
          layoutScroll
          className="flex h-full flex-col gap-4 px-4 py-2"
        >
          {places.map((place, i, arr) => {
            return (
              <PlaceCard
                key={place.id}
                place={place}
                handleDragEnd={handleDragEnd}
              />
            );
          })}
        </Reorder.Group>
      </div>
      <div className="sticky bottom-0 left-0 right-0 flex justify-between gap-2 bg-slate-100 px-2 py-1 text-sm">
        <h4>On the road</h4>
        <div className="flex gap-2">
          <span>{day.travel?.duration} min</span>
          <span>{day.travel?.distance} mi</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- TimePicker ------------------------------- */

type TimePickerProps = {
  day: Day;
  totalDuration: number;
};

function TimePicker({ day, totalDuration }: TimePickerProps) {
  const [startTime, setStartTime] = useState(day.startTime.slice(0, 5));
  // TODO: Switch to date so i don't have to make a new date each time state changes
  const endTime = addMinutes(
    parse(startTime, "HH:mm", new Date()),
    totalDuration,
  );

  // Set state when new data
  useEffect(() => {
    setStartTime(day.startTime.slice(0, 5));
  }, [day.id]);

  function resetTime() {
    setStartTime(day.startTime.slice(0, 5));
  }

  return (
    <form
      className=" flex flex-col items-center justify-between gap-2 border-slate-400 py-2"
      action={updateStartTime}
    >
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2">
          <Sun size={18} aria-label="Start time" />
          <input
            className="rounded-sm border border-slate-500 pl-1"
            type="time"
            id="startTime"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input type="hidden" name="id" defaultValue={day.id} />
          <button
            className="rounded-lg border border-slate-500 bg-slate-200 px-2"
            type="button"
            aria-label="Reset time"
            onClick={resetTime}
          >
            Reset
            {/* <Undo2 size={18} /> */}
          </button>
        </label>
      </div>
      <div className="flex flex-col items-center gap-1">
        <label className="flex items-center gap-2">
          <Moon size={18} aria-label="End Time" />
          <span id="endTime">{format(endTime, "HH:mm aa")}</span>
          <button
            className="rounded-lg border border-slate-500 bg-slate-200 px-2"
            aria-label="Save time"
          >
            Save
            {/* <Check size={18} /> */}
          </button>
        </label>
      </div>
    </form>
  );
}
