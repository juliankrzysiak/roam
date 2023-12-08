import { SetStateAction } from "react";
import { Place } from "@/types/types";

interface Props {
  places: Place[];
  setPlaces: React.Dispatch<SetStateAction<Place[]>>;
}

export default function Planner({ places, setPlaces }: Props) {
  return (
    <section className="absolute inset-4 left-10 top-1/2 h-5/6 w-4/12  -translate-y-1/2 rounded-xl border-4 border-emerald-600 bg-gray-100 shadow-lg ">
      {places.map((place) => {
        return (
          <div key={place.name}>
            <h1>{place.name}</h1>
            <h2>{place.category}</h2>
          </div>
        );
      })}
    </section>
  );
}
