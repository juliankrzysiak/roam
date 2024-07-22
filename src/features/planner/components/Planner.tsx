"use client";

import { Button } from "@/components/ui/button";
import PlaceCard from "@/features/planner/components/PlaceCard";
import { isPlannerVisibleAtom } from "@/lib/atom";
import { Day } from "@/types";
import { checkSameArr, mapId } from "@/utils";
import { updatePlaceOrder, updateStartTime } from "@/utils/actions/crud/update";
import clsx from "clsx";
import { addMinutes, parse } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Reorder } from "framer-motion";
import { useAtomValue } from "jotai";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDetectOutsideClick } from "../hooks";

type PlannerProps = {
  day: Day;
  tripName: string;
  totalDuration: number;
};

export default function Planner({
  day,
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
        "absolute left-0 top-0 z-10 flex h-full w-full flex-col border-r-2 border-emerald-600 bg-slate-100 sm:relative sm:max-w-sm",
        !isVisible && "hidden opacity-0",
      )}
    >
      <div className="sticky top-0 m-2 flex flex-col items-center rounded-md border-2 border-slate-400 shadow-md">
        <h2 className="py-1 text-center text-xl tracking-wide">{tripName}</h2>
        <hr className="w-full border-slate-400 " />
        <TimePicker day={day} totalDuration={totalDuration} />
      </div>
      <Reorder.Group
        axis="y"
        values={places}
        onReorder={setPlaces}
        layoutScroll
        className="flex h-full flex-1 flex-col gap-4 overflow-auto px-4 py-2"
      >
        {places.map((place) => {
          return (
            <PlaceCard
              key={place.id}
              place={place}
              timezone={day.timezone}
              handleDragEnd={handleDragEnd}
            />
          );
        })}
      </Reorder.Group>
      <div className="sticky bottom-0 left-0 right-0 flex justify-between gap-2 bg-slate-100 px-2 py-1 text-sm">
        <h4>On the road</h4>
        <div className="flex gap-2">
          <span>{day.travel?.duration} min</span>
          <span>{day.travel?.distance} miles</span>
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
  const formRef = useRef(null);
  useDetectOutsideClick(formRef, handleClickOutside);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [date, setDate] = useState(day.date);
  const startTime = formatInTimeZone(date, day.timezone, "HH:mm");
  const endTime = formatInTimeZone(
    addMinutes(date, totalDuration),
    day.timezone,
    "HH:mm aaa",
  );

  // Set state when new data
  useEffect(() => {
    setDate(day.date);
  }, [day.id]);

  function handleClickOutside() {
    setIsFormVisible(false);
    setDate(day.date);
  }

  return (
    <form
      className={clsx(
        "flex w-full items-center justify-evenly gap-2 px-2 py-2",
        isFormVisible && "flex-row",
      )}
      action={updateStartTime}
      ref={formRef}
      onClick={() => setIsFormVisible(true)}
    >
      <label className="flex items-center gap-2">
        <Sun size={18} aria-label="Start time" />
        {isFormVisible ? (
          <>
            <input
              className="rounded-sm border border-slate-500 pl-1"
              type="time"
              id="startTime"
              name="startTime"
              value={startTime}
              autoFocus
              onChange={(e) =>
                setDate(parse(e.target.value, "HH:mm", new Date()))
              }
            />
            <input type="hidden" name="id" defaultValue={day.id} />
          </>
        ) : (
          <span>{startTime}</span>
        )}
      </label>
      <label className="flex items-center gap-2">
        <Moon size={18} aria-label="End Time" />
        <span id="endTime">{endTime}</span>
        {isFormVisible && (
          <Button size="sm" aria-label="Save time">
            Save
          </Button>
        )}
      </label>
    </form>
  );
}
