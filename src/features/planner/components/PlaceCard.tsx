import { Button } from "@/components/ui/button";
import { currentPlaceAtom } from "@/lib/atom";
import { Place } from "@/types";
import { convertTime } from "@/utils";
import {
  updateNotes,
  updatePlaceDuration,
  updateTripDuration,
} from "@/utils/actions/crud/update";
import { add } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Reorder, useDragControls } from "framer-motion";
import { useAtom } from "jotai";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  ChevronRight,
  Clock,
  GripVertical,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useExit } from "../hooks";
import { Separator } from "@/components/ui/separator";

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
  const { id, placeId, position, name, schedule, placeDuration, travel } =
    place;
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [currentPlace, setCurrentPlace] = useAtom(currentPlaceAtom);
  const controls = useDragControls();

  useEffect(() => {
    if (currentPlace && currentPlace.placeId === placeId) {
      itemRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPlace, placeId]);

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
        <button onClick={handleClick} className="w-fit">
          <h2 className="text-lg font-bold underline underline-offset-2">
            {name}
          </h2>
        </button>
        <div className="flex h-full gap-4">
          <PlaceDuration
            arrival={schedule.arrival}
            placeDuration={placeDuration}
            placeId={id}
            timezone={timezone}
          />
          <Separator orientation="vertical" />
          <Notes placeId={place.id} notes={place.notes} />
        </div>
        <GripVertical
          size={24}
          className="absolute right-1 top-2 cursor-pointer text-slate-400"
          onPointerDown={(e) => controls.start(e)}
        />
      </article>
      {travel && (
        <TripDetails duration={travel.duration} distance={travel.distance} />
      )}
    </Reorder.Item>
  );
}

/* ---------------------------------- Notes --------------------------------- */

type NotesProps = {
  placeId: string;
  notes: Place["notes"];
};

export function Notes({ placeId, notes }: NotesProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleSubmit(formData: FormData) {
    const newNotes = formData.get("notes") as string;
    if (newNotes === notes) return;
    await updateNotes(newNotes, placeId);
  }

  return (
    <form
      action={handleSubmit}
      ref={formRef}
      onBlur={() => formRef.current?.requestSubmit()}
    >
      <textarea
        name="notes"
        className="h-full max-h-96 min-h-full w-full bg-inherit px-1"
        defaultValue={notes}
        maxLength={1000}
        placeholder="Add notes"
      />
    </form>
  );
}

/* ------------------------------- TripDetails ------------------------------ */

type TripDetailsProps = {
  duration: number;
  distance: number;
};

function TripDetails({ duration, distance }: TripDetailsProps) {
  const { hours, minutes } = convertTime({ minutes: duration });
  const formattedHours = hours ? hours + (hours > 1 ? " hrs" : " hr") : "";

  return (
    <div className="flex justify-between gap-2 px-5 py-1 text-sm">
      <span>
        {formattedHours} {minutes} mins
      </span>
      <span>
        {distance} {distance > 1 ? "miles" : "mile"}
      </span>
    </div>
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
  useExit(formRef, handleClickOutside);

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
    <div className="flex flex-shrink-0 flex-col gap-1">
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
