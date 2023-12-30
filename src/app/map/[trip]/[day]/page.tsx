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
  const { data: order } = await supabase
    .from("days")
    .select("order_places")
    .eq("id", day)
    .single();
  if (error) throw new Error(`Supabase error: ${error.message}`);

  return (
    <main className="relative h-20 flex-grow">
      <Map places={places} params={params} order={order?.order_places} />
      <Planner places={places} />
    </main>
  );
}
