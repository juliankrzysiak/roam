import { PlaceT, Time } from "@/types";
import Place from "./Place";
import Trip from "./Trip";

type Props = {
  place: PlaceT;
  time: Time;
  handleDragEnd: () => void;
};

export default function Card({ place, time, handleDragEnd }: Props) {
  return (
    <div>
      <Place place={place} time={time} handleDragEnd={handleDragEnd} />
      <Trip tripInfo={place.tripInfo} />
    </div>
  );
}
