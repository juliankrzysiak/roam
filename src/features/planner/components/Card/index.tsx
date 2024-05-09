import { PlaceInfo } from "@/types";
import { Reorder } from "framer-motion";
import PlaceTimes from "./PlaceTimes";
import TripForm from "./TripForm";

type Props = {
  place: PlaceInfo;
  handleDragEnd: () => void;
  last: boolean;
};

export default function Card({ place, handleDragEnd, last }: Props) {
  const { id, arrival, placeDuration, tripDuration } = place;
  return (
    <Reorder.Item value={place} id={place.id} onDragEnd={handleDragEnd}>
      <article className="flex flex-col gap-2 rounded-lg bg-slate-300 p-4 shadow-lg">
        <h1 className="font-bold underline">{place.name}</h1>
        <PlaceTimes
          arrival={arrival}
          placeDuration={placeDuration}
          placeId={id}
        />
      </article>
      {!last && <TripForm placeId={id} tripDuration={tripDuration} />}
    </Reorder.Item>
  );
}
