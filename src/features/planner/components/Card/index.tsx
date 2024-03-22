import { PlaceT, Time, Trip } from "@/types";
import { Reorder } from "framer-motion";
import DepartureForm from "./PlaceTimes";
import TripForm from "./TripForm";
import { Divide } from "lucide-react";
import PlaceTimes from "./PlaceTimes";

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
        <PlaceTimes arrival={time.arrival} placeId={place.id} />
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
