import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currentPlaceAtom } from "@/lib/atom";
import { Place } from "@/types";
import { convertTime, formatPlaceDuration, formatTravelTime } from "@/utils";
import { updateNotes, updatePlaceDuration } from "@/utils/actions/crud/update";
import { add } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Reorder, useDragControls } from "framer-motion";
import { useAtom } from "jotai";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  GripVertical,
} from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useExit } from "../hooks";
import PlaceOptions from "./Options/PlaceOptions";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

const svgSize = 16;

type PlaceCardProps = {
  place: Place;
  timezone: string;
  handleDragEnd: () => void;
  selectedPlaces: string[];
  setSelectedPlaces: Dispatch<SetStateAction<string[]>>;
};

export default function PlaceCard({
  place,
  timezone,
  handleDragEnd,
  selectedPlaces,
  setSelectedPlaces,
}: PlaceCardProps) {
  const {
    id,
    placeId,
    position,
    name,
    schedule,
    placeDuration,
    travel,
    notes,
  } = place;
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [currentPlace, setCurrentPlace] = useAtom(currentPlaceAtom);
  const controls = useDragControls();

  useEffect(() => {
    if (currentPlace && currentPlace.placeId === placeId) {
      itemRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [placeId]);

  function handleClick() {
    const currentPlace = { id, placeId, position };
    setCurrentPlace(currentPlace);
  }

  function handleChangeCheckbox(checked: CheckedState) {
    if (checked) {
      setSelectedPlaces([...selectedPlaces, id]);
    } else {
      setSelectedPlaces(selectedPlaces.filter((id) => id !== place.id));
    }
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
      <article className="relative flex flex-col gap-2 rounded-md border border-slate-400 bg-slate-200 py-2 pl-4 pr-1 shadow-sm">
        <div className="flex justify-between gap-2">
          <button onClick={handleClick} className="w-fit">
            <h2 className="text-left text-lg font-bold underline underline-offset-2">
              {name}
            </h2>
          </button>
          <PlaceOptions id={id} name={name} />
        </div>
        <div className="flex items-stretch gap-1">
          <div className="flex h-full gap-4">
            <PlaceDuration
              arrival={schedule.arrival}
              placeDuration={placeDuration}
              id={id}
              timezone={timezone}
            />
            <Separator orientation="vertical" />
            <Notes id={id} notes={notes} />
          </div>
          <div className="flex flex-col items-center justify-between">
            <div></div>
            <Checkbox
              className="text-lg"
              checked={selectedPlaces.includes(id)}
              onCheckedChange={handleChangeCheckbox}
            />
            <GripVertical
              size={24}
              className="cursor-pointer text-slate-500"
              onPointerDown={(e) => controls.start(e)}
            />
          </div>
        </div>
      </article>
      {travel && (
        <TripDetails duration={travel.duration} distance={travel.distance} />
      )}
    </Reorder.Item>
  );
}

/* ------------------------------- PlaceDuration ------------------------------- */

const timeFormat = "h:mm aaa";

type PlaceDurationProps = {
  arrival: Date;
  placeDuration: number;
  id: string;
  timezone: string;
};

function PlaceDuration({
  arrival,
  placeDuration,
  id,
  timezone,
}: PlaceDurationProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  useExit(formRef, handleClickOutside);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { hours, minutes } = convertTime({ minutes: placeDuration });
  const [hourDuration, setHourDuration] = useState(hours);
  const [minuteDuration, setMinuteDuration] = useState(minutes);
  const formattedPlaceDuration = formatPlaceDuration({ hours, minutes });
  const departure = add(arrival, {
    hours: hourDuration,
    minutes: minuteDuration,
  });

  function handleClickOutside() {
    setIsFormVisible(false);
    // * Resets current input
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
              <p>{formattedPlaceDuration}</p>
              <ChevronRight size={svgSize} />
            </div>
          )}
          <input type="hidden" name="id" defaultValue={id} />
        </label>
      </form>
      <span className="flex items-center gap-2">
        <ArrowLeft size={svgSize} />{" "}
        {formatInTimeZone(departure, timezone, timeFormat)}
      </span>
    </div>
  );
}

/* ---------------------------------- Notes --------------------------------- */

type NotesProps = {
  id: string;
  notes: Place["notes"];
};

export function Notes({ id, notes }: NotesProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <form
      action={updateNotes}
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
      <input name="id" type="hidden" defaultValue={id} />
      <input name="initialNotes" type="hidden" defaultValue={notes} />
    </form>
  );
}

/* ------------------------------- TripDetails ------------------------------ */

type TripDetailsProps = {
  duration: number;
  distance: number;
};

function TripDetails({ duration, distance }: TripDetailsProps) {
  const travelTime = formatTravelTime(convertTime({ minutes: duration }));

  return (
    <div className="flex justify-between gap-2 px-5 py-1 text-sm">
      <span>{travelTime}</span>
      <span>{distance} mi</span>
    </div>
  );
}
