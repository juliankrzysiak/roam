import Map from "@/features/map/components/Map";
import Planner from "@/features/planner/components";
import { unstable_cache } from "next/cache";

import { createSupabaseServerClient } from "@/utils/supabaseServerClient";

export default async function MapPage() {
  const supabase = createSupabaseServerClient();
  const { data: places, error } = await supabase.from("places").select("name");

  return (
    <main className="relative h-20 flex-grow">
      <Map />
      <Planner places={places} />
    </main>
  );
}
