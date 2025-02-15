import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { IsSharedContext } from "@/context/IsSharedContext";
import { currentPlaceAtom, insertBeforeIdAtom } from "@/lib/atom";
import { Place, Travel } from "@/types";
import { convertTime, formatPlaceDuration, formatTravelTime } from "@/utils";
import {
  updateNotes,
  updatePlaceDuration,
  updateRoutingProfile,
} from "@/utils/actions/crud/update";
import clsx from "clsx";
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
  X,
} from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useExit } from "../hooks";
import PlaceOptions from "./Options/PlaceOptions";

const svgSize = 16;

type PlaceCardProps = {
  index: number;
  dayId: string;
  place: Place;
  places: Place[];
  timezone: string;
  handleDragEnd: () => void;
  selectedPlaces: string[];
  setSelectedPlaces: Dispatch<SetStateAction<string[]>>;
};

export default function PlaceCard({
  index,
  dayId,
  place,
  places,
  timezone,
  handleDragEnd,
  selectedPlaces,
  setSelectedPlaces,
}: PlaceCardProps) {
  const { id, placeId, position, name, schedule, travel, notes } = place;
  const isShared = useContext(IsSharedContext);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [currentPlace, setCurrentPlace] = useAtom(currentPlaceAtom);
  const [insertBeforeId, setInsertBeforeId] = useAtom(insertBeforeIdAtom);
  const controls = useDragControls();

  const selected = selectedPlaces.includes(id);

  useEffect(() => {
    if (currentPlace?.id === id) {
      itemRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPlace?.id]);

  function handleClick() {
    const currentPlace = { id, placeId, position };
    setCurrentPlace(currentPlace);
  }

  function handleChangeCheckbox() {
    setSelectedPlaces([...selectedPlaces, id]);
  }

  function handleSelectPlace() {
    if (!selectedPlaces.length) return;
    if (!selected) {
      setSelectedPlaces([...selectedPlaces, id]);
    } else {
      setSelectedPlaces(selectedPlaces.filter((id) => id !== place.id));
    }
  }

  return (
    <Reorder.Item
      value={place}
      id={id}
      // Allows for dragging
      className={clsx(selected && "touch-none")}
      dragListener={false}
      dragControls={controls}
      onDragEnd={handleDragEnd}
      ref={itemRef}
      onClick={handleSelectPlace}
    >
      {insertBeforeId === id && (
        <div className="mb-2 flex items-center justify-between rounded-md bg-emerald-700 font-semibold text-slate-100">
          <p className="flex-1 text-center">New Places Go Here</p>
          <Button onClick={() => setInsertBeforeId(null)}>
            <X size={16} />
          </Button>
        </div>
      )}
      <div className="flex items-center">
        {Boolean(selectedPlaces.length) && (
          <GripVertical
            size={28}
            aria-label="Drag to reorder places."
            className="cursor-pointer text-slate-500"
            onPointerDown={(e) => !isShared && controls.start(e)}
          />
        )}
        <article
          className={clsx(
            "relative flex flex-grow flex-col gap-2 rounded-md border border-emerald-900 bg-slate-200 py-2 pl-7 pr-1 shadow-sm",
            selected && "border-4",
            selectedPlaces.length && "pointer-events-none",
          )}
        >
          <div className="flex justify-between gap-2">
            <button
              onClick={handleClick}
              className="w-fit"
              aria-label="Move to place on map."
            >
              <h2 className="text-left text-lg font-bold underline underline-offset-2">
                {name}
              </h2>
            </button>
            <PlaceOptions
              id={id}
              dayId={dayId}
              name={name}
              travel={travel}
              places={places}
            />
          </div>
          <span className="absolute left-0 top-0 rounded-br-md border-b border-r border-emerald-900 pl-1 pr-1 text-xs text-slate-900">
            {index + 1}
          </span>
          <div className=" flex items-stretch justify-between gap-1">
            <div className="flex h-full w-full gap-4">
              <PlaceDuration schedule={schedule} id={id} timezone={timezone} />
              <Separator orientation="vertical" />
              <Notes id={id} notes={notes} />
            </div>
            <label className="flex items-end px-1">
              <Checkbox
                checked={selectedPlaces.includes(id)}
                onCheckedChange={handleChangeCheckbox}
                aria-label="Select a place for further operations."
                disabled={isShared}
              />
            </label>
          </div>
        </article>
      </div>
      {travel && <TripDetails id={id} travel={travel} />}
    </Reorder.Item>
  );
}

/* ------------------------------- PlaceDuration ------------------------------- */

const timeFormat = "h:mm aaa";

type PlaceDurationProps = {
  id: string;
  schedule: Place["schedule"];
  timezone: string;
};

function PlaceDuration({ id, schedule, timezone }: PlaceDurationProps) {
  const isShared = useContext(IsSharedContext);
  const formRef = useRef<HTMLFormElement | null>(null);
  useExit(formRef, handleClickOutside);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { hours, minutes } = convertTime({ minutes: schedule.duration });
  const [hourDuration, setHourDuration] = useState(hours);
  const [minuteDuration, setMinuteDuration] = useState(minutes);
  const calculatedDeparture = add(schedule.arrival, {
    hours: hourDuration,
    minutes: minuteDuration,
  });
  const formattedPlaceDuration = formatPlaceDuration({ hours, minutes });

  function handleClickOutside() {
    setIsFormVisible(false);
    // * Resets current input
    setHourDuration(hours);
    setMinuteDuration(minutes);
  }

  return (
    <div className="flex flex-shrink-0 flex-col gap-1">
      <span className="flex items-center gap-2">
        <ArrowRight size={svgSize} />
        {formatInTimeZone(schedule.arrival, timezone, timeFormat)}
      </span>
      <form
        className="flex gap-2"
        action={async (formData) => {
          await updatePlaceDuration(formData);
          setIsFormVisible(false);
        }}
        ref={formRef}
      >
        <label
          className="flex cursor-pointer items-center gap-2"
          aria-label="Duration at location"
        >
          <Clock size={svgSize} />
          {isFormVisible && !isShared ? (
            <>
              <div className="flex gap-1">
                <input
                  aria-label="hours"
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
                  aria-label="minutes"
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
            <button
              className="flex items-center gap-1"
              type="button"
              aria-label="Click to expand form"
              onClick={() => setIsFormVisible(true)}
            >
              <span>{formattedPlaceDuration}</span>
              <ChevronRight
                size={svgSize}
                aria-label="Expand form for changing place duration."
              />
            </button>
          )}
          <input type="hidden" name="id" defaultValue={id} />
        </label>
      </form>
      <span className="flex items-center gap-2">
        <ArrowLeft size={svgSize} />
        <output>
          {formatInTimeZone(
            isFormVisible ? calculatedDeparture : schedule.departure,
            timezone,
            timeFormat,
          )}
        </output>
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
  const isShared = useContext(IsSharedContext);
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <form
      action={updateNotes}
      ref={formRef}
      onBlur={() => formRef.current?.requestSubmit()}
      className="w-full"
    >
      <textarea
        name="notes"
        className="h-full max-h-96 min-h-full w-full bg-inherit px-1 text-sm"
        defaultValue={notes}
        maxLength={1000}
        placeholder="Add notes"
        disabled={isShared}
      />
      <input name="id" type="hidden" defaultValue={id} />
      <input name="initialNotes" type="hidden" defaultValue={notes} />
    </form>
  );
}

/* ------------------------------- TripDetails ------------------------------ */

type TripDetailsProps = {
  id: string;
  travel: Travel;
};

function TripDetails({ id, travel }: TripDetailsProps) {
  const { distance, duration, routingProfile, isManual } = travel;
  const isShared = useContext(IsSharedContext);
  const formRef = useRef<HTMLFormElement>(null);
  const travelTime = formatTravelTime(convertTime({ minutes: duration }));

  return (
    <div className="flex justify-between gap-2 px-5 py-1 text-sm">
      <form action={updateRoutingProfile} ref={formRef}>
        <label className="flex gap-1">
          {travelTime}
          {isManual && "*"}
          <select
            defaultValue={routingProfile}
            name="routingProfile"
            onChange={() => formRef.current?.requestSubmit()}
            disabled={isShared}
          >
            <option value="driving">drive</option>
            <option value="walking">walk</option>
            <option value="cycling">cycle</option>
          </select>
        </label>
        <input type="hidden" name="id" defaultValue={id} />
      </form>
      <span>{distance} mi</span>
    </div>
  );
}
