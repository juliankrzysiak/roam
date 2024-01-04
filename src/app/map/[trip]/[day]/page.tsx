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

  const { data: places, error } = await supabase.rpc("get_places", { day });
  const { data: startTime } = await supabase
    .from("days")
    .select("start_time")
    .limit(1)
    .single();
  if (error) throw new Error(`Supabase error: ${error.message}`);

  return (
    <main className="relative h-20 flex-grow">
      <Map places={places} params={params} />
      <Planner places={places} start={startTime?.start_time} />
    </main>
  );
}
