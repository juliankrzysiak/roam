import { PlaceT, Time } from "@/types";
import Place from "./Place";
import Trip from "./Trip";
import { Reorder } from "framer-motion";

type Props = {
  place: PlaceT;
  time: Time;
  handleDragEnd: () => void;
};

export default function Card({ place, time, handleDragEnd }: Props) {
  return (
    <Reorder.Item value={place} id={place.id} onDragEnd={handleDragEnd}>
      <Place place={place} time={time} />
      <Trip tripInfo={place.tripInfo} />
    </Reorder.Item>
  );
}
