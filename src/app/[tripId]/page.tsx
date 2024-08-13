import TogglePlannerButton from "@/components/general/TogglePlannerButton";
import Map from "@/features/map/components/Map";
import MapControls from "@/features/map/components/MapControls";
import MapSearch from "@/features/map/components/MapSearch";
import Planner from "@/features/planner/components/Planner";
import { Database } from "@/types/supabase";
import { calcDateRange } from "@/utils";
import { getDay } from "@/utils/actions/crud/get";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  params: { tripId: string };
};

export default async function MapPage({ params }: Props) {
  const { tripId } = params;
  const supabase = createClient();

  const day = await getDay(supabase, tripId);
  const dateRange = await getDateRange(supabase, tripId);
  const tripName = await getTripName(supabase, tripId);

  const totalDuration = day.places.reduce(
    (total, current) =>
      total + (current.travel?.duration || 0) + current.placeDuration,
    0,
  );

  return (
    <main className="relative h-40 flex-grow sm:flex">
      <Planner
        day={day}
        tripName={tripName}
        totalDuration={totalDuration}
        dateRange={dateRange}
      />
      <Map day={day}>
        <MapSearch />
        <MapControls tripId={tripId} day={day} dateRange={dateRange} />
      </Map>
      <TogglePlannerButton />
    </main>
  );
}

async function getTripName(supabase: SupabaseClient<Database>, tripId: string) {
  const { data, error } = await supabase
    .from("trips")
    .select("name")
    .eq("id", tripId)
    .limit(1)
    .single();
  if (error) throw new Error(`${error.message}`);
  return data.name;
}

async function getDateRange(
  supabase: SupabaseClient<Database>,
  tripId: string,
) {
  const { data, error } = await supabase
    .from("days")
    .select("date")
    .eq("trip_id", tripId);
  if (error) throw new Error(`${error.message}`);
  const dateRange = calcDateRange(data);
  return dateRange;
}
