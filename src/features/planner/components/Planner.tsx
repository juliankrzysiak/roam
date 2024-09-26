"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IsSharedContext } from "@/context/IsSharedContext";
import PlaceCard from "@/features/planner/components/PlaceCard";
import { isPlannerVisibleAtom } from "@/lib/atom";
import { DateRange, Day } from "@/types";
import { checkSameArr, convertTime, formatTravelTime, mapId } from "@/utils";
import { deletePlaces } from "@/utils/actions/crud/delete";
import {
  movePlaces,
  updatePlaceOrder,
  updateStartTime,
} from "@/utils/actions/crud/update";
import clsx from "clsx";
import { addMinutes, parse } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Reorder } from "framer-motion";
import { useAtomValue } from "jotai";
import { EllipsisVertical, Moon, Sun, XIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useExit } from "../hooks";
import PlannerOptions from "./Options/PlannerOptions";

type PlannerProps = {
  day: Day;
  tripId: string;
  tripName: string;
  totalDuration: number;
  dateRange: DateRange;
  isShared: boolean;
};

export default function Planner({
  day,
  tripId,
  tripName,
  totalDuration,
  dateRange,
  isShared,
}: PlannerProps) {
  const isVisible = useAtomValue(isPlannerVisibleAtom);
  const [places, setPlaces] = useState(day.places);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

  function handleDragEnd() {
    const [orderOriginalPlaces, orderPlaces] = [day.places, places].map(mapId);
    const isSameArr = checkSameArr(orderOriginalPlaces, orderPlaces);
    if (!isSameArr) updatePlaceOrder(orderPlaces, day.id);
  }

  useEffect(() => {
    setPlaces(day.places);
  }, [day.places]);

  async function handleDelete() {
    await deletePlaces({
      placesToDelete: selectedPlaces,
      places,
      dayId: day.id,
    });
    setSelectedPlaces([]);
  }

  async function handleMove(newDate: string) {
    await movePlaces({
      placesToMove: selectedPlaces,
      places,
      currentDayId: day.id,
      newDate,
      tripId,
    });
    setSelectedPlaces([]);
  }

  function handleSelectAll() {
    setSelectedPlaces(mapId(places));
  }

  function handleDeselectAll() {
    setSelectedPlaces([]);
  }

  return (
    <IsSharedContext.Provider value={isShared}>
      <section
        className={clsx(
          "absolute left-0 top-0 z-10 flex h-full w-full flex-col border-r-2 border-emerald-900 bg-slate-100 sm:relative sm:max-w-xs md:max-w-sm",
          !isVisible && "hidden opacity-0",
        )}
      >
        <div className="sticky top-0 m-2 flex flex-col items-center rounded-md border-2 border-slate-400 shadow-md">
          <div className="item flex w-full items-center justify-between px-1">
            <EllipsisVertical size={18} className="invisible" />
            <h2 className="py-1 text-center text-xl tracking-wide">
              {tripName}
            </h2>
            <PlannerOptions handleSelectAll={handleSelectAll} />
          </div>
          <hr className="w-full border-slate-400 " />
          <TimePicker day={day} totalDuration={totalDuration} />
        </div>
        {Boolean(selectedPlaces.length) && (
          <SelectOptions
            day={day}
            dateRange={dateRange}
            tripId={tripId}
            handleMove={handleMove}
            handleDelete={handleDelete}
            handleDeselectAll={handleDeselectAll}
            selectedPlacesLength={selectedPlaces.length}
          />
        )}
        <Reorder.Group
          axis="y"
          values={places}
          onReorder={setPlaces}
          layoutScroll
          className={clsx(
            "flex h-full flex-1 flex-col gap-4 overflow-auto px-4 py-2",
            selectedPlaces.length && "pl-0",
          )}
        >
          {places.length < 1 && (
            <p className="text-center text-sm text-slate-600">
              Add your starting location!
              <br />
              Click a place on the map or search for it!
            </p>
          )}
          {places.map((place, i) => {
            return (
              <PlaceCard
                key={place.id}
                index={i}
                dayId={day.id}
                place={place}
                places={day.places}
                timezone={day.timezone}
                handleDragEnd={handleDragEnd}
                selectedPlaces={selectedPlaces}
                setSelectedPlaces={setSelectedPlaces}
              />
            );
          })}
        </Reorder.Group>
        <div className="sticky bottom-0 left-0 right-0 flex justify-between gap-2 px-4 py-1 text-sm">
          <h4>Total</h4>
          <div className="flex gap-2">
            <span>
              {formatTravelTime(convertTime({ minutes: day.travel.duration }))}
            </span>
            <span className="text-slate-500">|</span>
            <span>{day.travel.distance} mi</span>
          </div>
        </div>
      </section>
    </IsSharedContext.Provider>
  );
}

/* ------------------------------- TimePicker ------------------------------- */

type TimePickerProps = {
  day: Day;
  totalDuration: number;
};

function TimePicker({ day, totalDuration }: TimePickerProps) {
  const isShared = useContext(IsSharedContext);
  const formRef = useRef(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [date, setDate] = useState(day.date);
  const startTime = formatInTimeZone(date, day.timezone, "HH:mm");
  const formattedStartTime = formatInTimeZone(date, day.timezone, "h:mm aa");
  const endTime = formatInTimeZone(
    addMinutes(date, totalDuration),
    day.timezone,
    "h:mm aa",
  );

  useExit(formRef, handleClickOutside);

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
      action={async (formData) => {
        await updateStartTime(formData);
        setIsFormVisible(false);
      }}
      ref={formRef}
      onClick={() => setIsFormVisible(true)}
    >
      <label className="flex items-center gap-2">
        <Sun size={18} aria-label="Start time" />
        {isFormVisible && !isShared ? (
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
            <Button size="sm" aria-label="Save time">
              Save
            </Button>
          </>
        ) : (
          <span>{formattedStartTime}</span>
        )}
      </label>
      <label className="flex items-center gap-2">
        <Moon size={18} aria-label="End Time" />
        <output>{endTime}</output>
      </label>
    </form>
  );
}

type SelectOptionsProps = {
  day: Day;
  dateRange: DateRange;
  tripId: string;
  handleMove: (newDate: string) => Promise<void>;
  handleDelete: () => Promise<void>;
  handleDeselectAll: () => void;
  selectedPlacesLength: number;
};

const dateFormat = "yyyy-MM-dd";

function SelectOptions({
  day,
  dateRange,
  tripId,
  handleMove,
  handleDelete,
  handleDeselectAll,
  selectedPlacesLength,
}: SelectOptionsProps) {
  const { id: dayId, date, timezone } = day;
  const [open, setOpen] = useState(false);
  const initialDateString = formatInTimeZone(date, timezone, dateFormat);
  const [dateString, setDateString] = useState(initialDateString);
  const minDateString = formatInTimeZone(dateRange.from, timezone, dateFormat);
  const maxDateString = formatInTimeZone(dateRange.to, timezone, dateFormat);

  async function handleSubmit() {
    if (dateString === initialDateString) setOpen(false);
    else {
      await handleMove(dateString);
      setOpen(false);
    }
  }

  return (
    <div className="mx-2 flex justify-between rounded-md border-2 border-slate-400 px-2 py-2 text-sm shadow-lg">
      <span>
        {selectedPlacesLength} {selectedPlacesLength > 1 ? "places" : "place"}{" "}
        selected
      </span>
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(true)}>Move</button>
        <form action={handleDelete}>
          <button>Delete</button>
        </form>
        <button className="ml-2" onClick={handleDeselectAll}>
          <XIcon size={16} />
        </button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Places to New Date</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit}>
            <input
              name="date"
              type="date"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              min={minDateString}
              max={maxDateString}
            />
            <input name="tripId" type="hidden" defaultValue={tripId} />
            <input name="dayId" type="hidden" defaultValue={dayId} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
