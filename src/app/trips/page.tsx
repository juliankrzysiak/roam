import Trip from "@/features/trips/components/Trip";
import { createSupabaseServerClient } from "@/utils/supabaseServerClient";
import { cookies } from "next/headers";

export default async function Trips() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const { data: trips, error } = await supabase.from("trips").select();
  // TODO: Create error boundary
  if (error) return <div>error</div>;
  return (
    <div className="flex flex-col items-center">
      <h1>Trips</h1>
      {trips.map((trip) => {
        return <Trip key={trip.id} name={trip.name} id={trip.id} />;
      })}
    </div>
  );
}
