import { Button } from "@/components/ui/button";
import { currentPlaceAtom } from "@/lib/atom";
import { Place } from "@/types";
import { convertTime } from "@/utils";
import {
  updatePlaceDuration,
  updateTripDuration,
} from "@/utils/actions/crud/update";
import { add, format } from "date-fns";
import { Reorder, useDragControls } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  ChevronRight,
  Clock,
  GripVertical,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDetectOutsideClick } from "../hooks";
import { formatInTimeZone } from "date-fns-tz";

const svgSize = 16;

type PlaceCardProps = {
  place: Place;
  handleDragEnd: () => void;
  timezone: string;
};

export default function PlaceCard({
  place,
  handleDragEnd,
  timezone,
}: PlaceCardProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const { id, placeId, position, name, schedule, placeDuration, travel } =
    place;
  const currentPlace = useAtomValue(currentPlaceAtom);
  const setCurrentPlace = useSetAtom(currentPlaceAtom);
  const controls = useDragControls();

  useEffect(() => {
    if (currentPlace && currentPlace.placeId === placeId) {
      itemRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPlace]);

  function handleClick() {
    const currentPlace = { id, placeId, position };
    setCurrentPlace(currentPlace);
  }

  return (
    <Reorder.Item
      value={place}
      id={id}
      className="touch-none"
      dragListener={false}
      dragControls={controls}
      onDragEnd={handleDragEnd}
      ref={itemRef}
    >
      <article className="relative flex flex-col gap-2 rounded-md border border-slate-400 bg-slate-200 px-4 py-2 shadow-sm">
        <h2 className="text-xl font-bold underline" onClick={handleClick}>
          {name}
        </h2>
        <PlaceDuration
          arrival={schedule.arrival}
          placeDuration={placeDuration}
          placeId={id}
          timezone={timezone}
        />
        <GripVertical
          size={24}
          className="absolute bottom-2 right-1 cursor-pointer text-slate-400"
          onPointerDown={(e) => controls.start(e)}
        />
      </article>
      {travel && (
        <div className="flex justify-between gap-2 px-4 py-1 text-sm">
          <span>{travel.duration} min</span>
          <span>
            {travel.distance} {travel.duration > 1 ? "miles" : "mile"}
          </span>
        </div>
      )}
    </Reorder.Item>
  );
}

/* ------------------------------- PlaceDuration ------------------------------- */

const timeFormat = "h:mm aaa";

type PlaceDurationProps = {
  arrival: Date;
  placeDuration: number;
  placeId: string;
  timezone: string;
};

function PlaceDuration({
  arrival,
  placeDuration,
  placeId,
  timezone,
}: PlaceDurationProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  useDetectOutsideClick(formRef, handleClickOutside);

  const { hours, minutes } = convertTime({ minutes: placeDuration });
  const [hourDuration, setHourDuration] = useState(hours);
  const [minuteDuration, setMinuteDuration] = useState(minutes);
  const departure = add(arrival, {
    hours: hourDuration,
    minutes: minuteDuration,
  });

  function handleClickOutside() {
    setIsFormVisible(false);
    // Resets current input
    setHourDuration(hours);
    setMinuteDuration(minutes);
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2">
        <ArrowRight size={svgSize} />{" "}
        {formatInTimeZone(arrival, timezone, timeFormat)}
      </span>
      <form
        className="flex gap-2"
        action={async (formData) => {
          await updatePlaceDuration(formData);
          setIsFormVisible(false);
        }}
        ref={formRef}
        onClick={() => setIsFormVisible(true)}
      >
        <label
          className="flex cursor-pointer items-center gap-2"
          aria-label="Duration at location"
        >
          <Clock size={svgSize} />
          {isFormVisible ? (
            <>
              <div className="flex gap-1">
                <input
                  className="w-12 rounded-md border border-slate-500 pl-1"
                  name="hours"
                  type="number"
                  min="0"
                  max="12"
                  value={hourDuration}
                  onChange={(e) => setHourDuration(Number(e.target.value))}
                />
                :
                <input
                  className="w-12 rounded-md border border-slate-500 pl-1"
                  name="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minuteDuration.toString().padStart(2, "0")}
                  onChange={(e) => setMinuteDuration(Number(e.target.value))}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                type="submit"
                className="ml-1"
              >
                Save
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <span>
                {hourDuration}:{minuteDuration.toString().padStart(2, "0")}
              </span>
              <ChevronRight size={svgSize} />
            </div>
          )}
          <input type="hidden" name="id" defaultValue={placeId} />
        </label>
      </form>
      <span className="flex items-center gap-2">
        <ArrowLeft size={svgSize} />{" "}
        {formatInTimeZone(departure, timezone, timeFormat)}
      </span>
    </div>
  );
}

/* -------------------------------- TravelDuration -------------------------------- */

type TravelDurationProps = {
  placeId: string;
  tripDuration: number;
};

function TravelDuration({ placeId, tripDuration }: TravelDurationProps) {
  const { hours, minutes } = convertTime({ minutes: tripDuration });
  const [hourDuration, setHourDuration] = useState(hours);
  const [minuteDuration, setMinuteDuration] = useState(minutes);

  return (
    <form
      className="flex items-end gap-2 py-2 pl-4"
      action={updateTripDuration}
    >
      <label className="flex items-center gap-1">
        <Car size={svgSize} />
        <input
          className="rounded-md pl-1"
          name="hours"
          type="number"
          min="0"
          max="12"
          value={hourDuration}
          onChange={(e) => setHourDuration(Number(e.target.value))}
        />
        :
        <input
          className="rounded-md pl-1"
          name="minutes"
          type="number"
          min="0"
          max="59"
          value={minuteDuration}
          onChange={(e) => setMinuteDuration(Number(e.target.value))}
        />
      </label>
      <input type="hidden" name="id" defaultValue={placeId} />
      <button>Save</button>
    </form>
  );
}
