import { PlaceInfo } from "@/types";
import { Reorder, useDragControls } from "framer-motion";
import PlaceTimes from "./PlaceTimes";
import TripForm from "./TripForm";
import { usePopupStore } from "@/lib/store";
import { ReorderIcon } from "@/components/general/ReorderIcon";

type Props = {
  place: PlaceInfo;
  handleDragEnd: () => void;
  last: boolean;
};

export default function Card({ place, handleDragEnd, last }: Props) {
  const { id, arrival, placeDuration, tripDuration } = place;
  const updatePopup = usePopupStore((state) => state.updatePopup);
  const controls = useDragControls();

  function onClickTitle() {
    updatePopup(place);
  }

  return (
    <Reorder.Item
      value={place}
      id={place.id}
      dragListener={false}
      dragControls={controls}
      onDragEnd={handleDragEnd}
    >
      <article className="flex flex-col gap-2 rounded-lg bg-slate-300 p-4 shadow-lg">
        <h1 className="font-bold underline" onClick={onClickTitle}>
          {place.name}
        </h1>
        <PlaceTimes
          arrival={arrival}
          placeDuration={placeDuration}
          placeId={id}
        />
        <ReorderIcon dragControls={controls} />
      </article>
      {!last && <TripForm placeId={id} tripDuration={tripDuration} />}
    </Reorder.Item>
  );
}
