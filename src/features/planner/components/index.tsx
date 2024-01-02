"use client";

import { PlaceT } from "@/types";
import { updateOrder, updateStartTime } from "@/utils/actions";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { add, format, parse } from "date-fns";
import Place from "./Place";
import { startTransition, useOptimistic } from "react";

type Props = {
  places: PlaceT[];
  order: string[];
};

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

export default function Planner({ places }: Props) {
  const [optimisticPlaces, updateOptimisticPlaces] = useOptimistic<PlaceT[]>(
    places,
    (state: PlaceT, newOrder: PlaceT[]) => newOrder,
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const order = places.map((e) => e.id) as UniqueIdentifier[];
      const oldIndex = order.indexOf(active.id);
      const newIndex = order.indexOf(over.id);

      const orderedPlaces = arrayMove(places, oldIndex, newIndex);
      const orderedArr = orderedPlaces.map((e) => e.id);
      startTransition(() => {
        updateOptimisticPlaces(orderedPlaces);
        updateOrder(orderedArr);
      });
    }
  }

  let startTime = parse("08:00", "HH:mm", new Date());
  let endTime;

  //TODO: move order to client side, since i want the order to be updated separately from the content

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={places} strategy={verticalListSortingStrategy}>
        <section className="absolute inset-4 left-10 top-1/2 h-5/6 w-4/12  -translate-y-1/2 rounded-xl border-4 border-emerald-600 bg-gray-100 shadow-lg ">
          <div className="h-20 border-4 border-b"></div>
          <form action={updateStartTime}>
            <label className="flex w-fit flex-col">
              Start time
              <input
                type="time"
                name="startTime"
                defaultValue={format(startTime, "HH:mm")}
              />
              <button>Submit</button>
            </label>
          </form>
          {optimisticPlaces.map((place, i, arr) => {
            const arrival = startTime;
            const departure = add(arrival, { minutes: place.duration });
            startTime = departure;
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
      </SortableContext>
    </DndContext>
  );
}
