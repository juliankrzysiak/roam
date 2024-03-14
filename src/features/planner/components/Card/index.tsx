import { PlaceT, Time } from "@/types";
import { format } from "date-fns";
import { Reorder } from "framer-motion";
import PlaceForm from "./PlaceForm";
import TripForm from "./TripForm";

const timeFormat = "HH:mm a";

type Props = {
  place: PlaceT;
  time: Time;
  handleDragEnd: () => void;
};

export default function Card({ place, time, handleDragEnd }: Props) {
  return (
    <Reorder.Item
      value={place}
      id={place.id}
      onDragEnd={handleDragEnd}
      className="flex flex-col gap-2 rounded-lg bg-slate-300 p-4 shadow-lg"
    >
      <h1 className="font-bold underline">{place.name}</h1>
      <p>&gt; {format(time.arrival, timeFormat)}</p>
      <PlaceForm place={place} />
      <TripForm tripInfo={place.tripInfo} />
    </Reorder.Item>
  );
}
