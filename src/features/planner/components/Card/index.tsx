import { PlaceT, Time, Trip } from "@/types";
import { format } from "date-fns";
import { Reorder } from "framer-motion";
import PlaceForm from "./PlaceForm";
import TripForm from "./TripForm";
import { Divide } from "lucide-react";

const timeFormat = "HH:mm a";

type Props = {
  place: PlaceT;
  time: Time;
  tripInfo: Trip | undefined;
  handleDragEnd: () => void;
};

export default function Card({ place, time, tripInfo, handleDragEnd }: Props) {
  return (
    <Reorder.Item value={place} id={place.id} onDragEnd={handleDragEnd}>
      <article className="flex flex-col gap-2 rounded-lg bg-slate-300 p-4 shadow-lg">
        <h1 className="font-bold underline">{place.name}</h1>
        <p>&gt; {format(time.arrival, timeFormat)}</p>
        <PlaceForm place={place} />
        {/* <TripForm tripInfo={place.tripInfo} /> */}
      </article>
      {tripInfo && (
        <div className="flex justify-between px-4 py-2">
          <p>{tripInfo.duration} minutes</p>
          <p>{tripInfo.distance} miles</p>
        </div>
      )}
    </Reorder.Item>
  );
}
