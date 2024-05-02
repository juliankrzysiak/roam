import { PlaceInfo } from "@/types";
import { Reorder } from "framer-motion";
import PlaceTimes from "./PlaceTimes";
import TripForm from "./TripForm";

type Props = {
  place: PlaceInfo;
  // tripInfo: Trip | undefined;
  handleDragEnd: () => void;
};

export default function Card({ place, handleDragEnd }: Props) {
  const { id, arrival, placeDuration } = place;
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
      <TripForm />
    </Reorder.Item>
  );
}
