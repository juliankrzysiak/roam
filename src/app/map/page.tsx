import Map from "@/features/map/components/Map";
import Planner from "@/features/planner/components";
import { unstable_cache } from "next/cache";

import { createSupabaseServerClient } from "@/utils/supabaseServerClient";

const getPlaces = unstable_cache(async () => {
  const supabase = createSupabaseServerClient();
  try {
    const { data, error } = await supabase.from("places").select("id, name");
    if (error) throw new Error(`Supabase error: ${error.message}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}, ["places"]);

export default async function MapPage() {
  const places = await getPlaces();
  return (
    <main className="relative h-20 flex-grow">
      <Map />
      <Planner places={places} />
    </main>
  );
}
