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
import { useState } from "react";

type PlaceCardProps = {
  place: PlaceInfo;
  handleDragEnd: () => void;
  last: boolean;
};

export default function PlaceCard({ place, handleDragEnd, last }: PlaceCardProps) {
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
      <article className="flex flex-col gap-2 rounded-lg bg-slate-300 px-4 py-2 shadow-lg">
        <h1 className="text-xl font-bold underline" onClick={handleClick}>
          {place.name}
        </h1>
        <PlaceTimes
          arrival={arrival}
          placeDuration={placeDuration}
          placeId={id}
        />
        {/* // BUG dragging is broken */}
        {/* <ReorderIcon dragControls={controls} /> */}
      </article>
      {!last && <TripForm placeId={id} tripDuration={tripDuration} />}
    </Reorder.Item>
  );
}

/* ------------------------------- PlaceTimes ------------------------------- */

const timeFormat = "h:mm aaa";

type PlaceTimesProps = {
  arrival: Date;
  placeDuration: number;
  placeId: string;
};

function PlaceTimes({ arrival, placeDuration, placeId }: PlaceTimesProps) {
  const { hours, minutes } = convertTime({ minutes: placeDuration });
  const [hourDuration, setHourDuration] = useState(hours);
  const [minuteDuration, setMinuteDuration] = useState(minutes);
  const departure = add(arrival, {
    hours: hourDuration,
    minutes: minuteDuration,
  });

  return (
    <form className="flex justify-between gap-2" action={updatePlaceDuration}>
      <p className="text-center">{format(arrival, timeFormat)}</p>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1">
          <input
            className="max-w-xs px-1"
            name="hours"
            type="number"
            min="0"
            max="12"
            defaultValue={hourDuration}
            onChange={(e) => setHourDuration(Number(e.target.value))}
          />
          :
          <input
            className="max-w-xs px-1"
            name="minutes"
            type="number"
            min="0"
            max="59"
            defaultValue={minuteDuration}
            onChange={(e) => setMinuteDuration(Number(e.target.value))}
          />
        </label>
        <input type="hidden" name="id" defaultValue={placeId} />
        <button type="submit">Submit</button>
      </div>
      <p className="text-center">{format(departure, timeFormat)}</p>
    </form>
  );
}

/* -------------------------------- TripForm -------------------------------- */

type TripFormProps = {
  placeId: string;
  tripDuration: number;
};

function TripForm({ placeId, tripDuration }: TripFormProps) {
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
