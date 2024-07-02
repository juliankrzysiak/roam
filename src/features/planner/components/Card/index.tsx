import { PlaceInfo } from "@/types";
import { Reorder, useDragControls } from "framer-motion";
import PlaceTimes from "./PlaceTimes";
import TripForm from "./TripForm";
import { ReorderIcon } from "@/components/general/ReorderIcon";
import { useSetAtom } from "jotai";
import { currentPlaceAtom } from "@/lib/atom";

type Props = {
  place: PlaceInfo;
  handleDragEnd: () => void;
  last: boolean;
};

export default function Card({ place, handleDragEnd, last }: Props) {
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
