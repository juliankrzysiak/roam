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
import { useSetAtom } from "jotai";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  ChevronRight,
  Clock,
  GripVertical,
} from "lucide-react";
import { useRef, useState } from "react";
import { useDetectOutsideClick } from "../hooks";

const svgSize = 16;

type PlaceCardProps = {
  place: Place;
  handleDragEnd: () => void;
};

export default function PlaceCard({ place, handleDragEnd }: PlaceCardProps) {
  const { id, placeId, position, name, schedule, placeDuration, travel } =
    place;
  const setCurrentPlace = useSetAtom(currentPlaceAtom);
  const controls = useDragControls();

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
    >
      <article className="relative flex flex-col gap-2 rounded-md border border-slate-400 bg-slate-200 px-4 py-2 shadow-sm">
        <h2 className="text-xl font-bold underline" onClick={handleClick}>
          {name}
        </h2>
        <div className="flex items-end justify-between gap-2">
          <PlaceDuration
            arrival={schedule.arrival}
            placeDuration={placeDuration}
            placeId={id}
          />
          <GripVertical
            size={24}
            className="absolute bottom-2 right-1 text-slate-400"
            onPointerDown={(e) => controls.start(e)}
          />
        </div>
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
};

function PlaceDuration({
  arrival,
  placeDuration,
  placeId,
}: PlaceDurationProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  useDetectOutsideClick(formRef, () => setFormVisible(false));

  const { hours, minutes } = convertTime({ minutes: placeDuration });
  const [hourDuration, setHourDuration] = useState(hours);
  const [minuteDuration, setMinuteDuration] = useState(minutes);
  const departure = add(arrival, {
    hours: hourDuration,
    minutes: minuteDuration,
  });

  function handleReset() {
    setHourDuration(hours);
    setMinuteDuration(minutes);
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2">
        <ArrowRight size={svgSize} /> {format(arrival, timeFormat)}
      </span>
      <form
        className="flex gap-2"
        action={updatePlaceDuration}
        ref={formRef}
        onClick={() => setFormVisible(true)}
      >
        <label
          className="flex cursor-pointer items-center gap-2"
          aria-label="Duration at location"
        >
          <Clock size={svgSize} />
          {formVisible ? (
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
                value={minuteDuration}
                onChange={(e) => setMinuteDuration(Number(e.target.value))}
              />
              <Button size="sm" variant="secondary" type="submit">
                Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                type="button"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
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
        <ArrowLeft size={svgSize} /> {format(departure, timeFormat)}
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
