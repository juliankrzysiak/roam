import { SetStateAction } from "react";
import { PlaceT } from "@/types";
import Place from "./Place";

interface Props {
  places: PlaceT[];
  setPlaces: React.Dispatch<SetStateAction<PlaceT[]>>;
}

export default function Planner({ places, setPlaces }: Props) {
  return (
    <section className="absolute inset-4 left-10 top-1/2 h-5/6 w-4/12  -translate-y-1/2 rounded-xl border-4 border-emerald-600 bg-gray-100 shadow-lg ">
      <div className="h-20 border-4 border-b"></div>
      {places.map((place) => {
        return (
          <Place key={place.name} name={place.name} category={place.category} />
        );
      })}
    </section>
  );
}
