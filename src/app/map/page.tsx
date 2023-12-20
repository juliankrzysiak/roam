import Map from "@/features/map/components/Map";
import Planner from "@/features/planner/components";
import { unstable_cache } from "next/cache";

import { createSupabaseServerClient } from "@/utils/supabaseServerClient";

export default async function MapPage() {
  const supabase = createSupabaseServerClient();

  const getPlaces = unstable_cache(
    async () => (await supabase.from("places").select("id, name")).data,
    ["places"],
  );

  const places = await getPlaces();

  return (
    <main className="relative h-20 flex-grow">
      <Map />
      <Planner places={places} />
    </main>
  );
}
