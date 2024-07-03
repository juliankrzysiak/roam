import { currentPlaceAtom } from "@/lib/atom";
import { PlaceInfo } from "@/types";
import { convertTime } from "@/utils";
import {
  updatePlaceDuration,
  updateTripDuration,
} from "@/utils/actions/crud/update";
import { add, format } from "date-fns";
import { Reorder, useDragControls } from "framer-motion";
import { useSetAtom } from "jotai";
import { ArrowLeft, ArrowRight, Clock, Undo2 } from "lucide-react";
import { useState } from "react";

type PlaceCardProps = {
  place: PlaceInfo;
  handleDragEnd: () => void;
  last: boolean;
};

export default function PlaceCard({
  place,
  handleDragEnd,
  last,
}: PlaceCardProps) {
  const { id, arrival, placeDuration, tripDuration } = place;
  const setCurrentPlace = useSetAtom(currentPlaceAtom);
  const controls = useDragControls();

  function handleClick() {
    const { id, placeId, position } = place;
    const currentPlace = { id, placeId, position };
    setCurrentPlace(currentPlace);
  }

  return (
    <Reorder.Item
      value={place}
      id={place.id}
      dragListener={false}
      dragControls={controls}
      onDragEnd={handleDragEnd}
    >
      <article className="flex flex-col gap-2 rounded-lg bg-slate-200 px-4 py-2 shadow-lg">
        <h1 className="text-xl font-bold underline" onClick={handleClick}>
          {place.name}
        </h1>
        <PlaceDuration
          arrival={arrival}
          placeDuration={placeDuration}
          placeId={id}
        />
        {/* // BUG dragging is broken */}
        {/* <ReorderIcon dragControls={controls} /> */}
      </article>
      {!last && <TravelDuration placeId={id} tripDuration={tripDuration} />}
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
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2">
        <ArrowRight size={16} /> {format(arrival, timeFormat)}
      </span>
      <form className="flex gap-2" action={updatePlaceDuration}>
        <label
          className="flex items-center gap-2"
          aria-label="Duration at location"
        >
          <Clock size={16} />
          <div className="flex gap-1">
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
          </div>
          <input type="hidden" name="id" defaultValue={placeId} />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={handleReset}>
          <Undo2 size={16} />
        </button>
      </form>
      <span className="flex items-center gap-2">
        <ArrowLeft size={16} /> {format(departure, timeFormat)}
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

  return (
    <form className="flex items-end gap-2" action={updateTripDuration}>
      <label className="flex">
        <input
          className="px-1"
          name="hours"
          type="number"
          min="0"
          max="12"
          defaultValue={hours}
        />
        :
        <input
          className="px-1"
          name="minutes"
          type="number"
          min="0"
          max="59"
          defaultValue={minutes}
        />
      </label>
      <input type="hidden" name="id" defaultValue={placeId} />
      <button>Submit</button>
    </form>
  );
}
