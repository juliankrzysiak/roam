import Map from "@/features/map/components";
import Planner from "@/features/planner/components";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface Params {
  params: { trip: number; day: number };
}

export default async function MapPage({ params }: Params) {
  const { day } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: places, error } = await supabase
    .from("places")
    .select("*, days (order_places)")
    .eq("day_id", day);
  if (error) throw new Error(`Supabase error: ${error.message}`);
  const order = places[0].days.order_places;

  return (
    <main className="relative h-20 flex-grow">
      <Map places={places} params={params} order={order} />
      <Planner places={places} order={order} />
    </main>
  );
}
