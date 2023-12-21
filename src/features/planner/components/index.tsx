import { PlaceT } from "@/types";
import { add, format, parse } from "date-fns";
import Place from "./Place";

interface Props {
  places: PlaceT[];
}

// async function getRoute(places: PlaceT[]) {
// const coordinates = places
// .map((place) => `${place.lngLat.lng},${place.lngLat.lat}`)
// .join(";");
//
// const profile = "mapbox/driving";
// const res = await fetch(
// `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?annotations=distance,duration&overview=full&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`,
// );
// return res.json();
// }

export default async function Planner({ places }: Props) {
  let prev = parse("08:00", "HH:mm", new Date());
  let endTime;

  return (
    <section className="absolute inset-4 left-10 top-1/2 h-5/6 w-4/12  -translate-y-1/2 rounded-xl border-4 border-emerald-600 bg-gray-100 shadow-lg ">
      <div className="h-20 border-4 border-b"></div>
      <label className="flex w-fit flex-col">
        Start time
        <input type="time" defaultValue={format(prev, "HH:mm")} />
      </label>
      {places.map((place, i, arr) => {
        const arrival = prev;
        const departure = add(arrival, { minutes: place.duration });
        prev = departure;
        if (i === arr.length - 1) endTime = format(departure, "HH:mm");
        return (
          <Place
            key={place.id}
            place={place}
            arrival={arrival}
            departure={departure}
          />
        );
      })}
      <span className="flex w-fit flex-col">End Time {endTime ?? 0}</span>
    </section>
  );
}
