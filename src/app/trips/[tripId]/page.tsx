import { mapDateRange } from "@/utils";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: { tripId: string };
};

export default async function TripPage({ params }: Props) {
  const { tripId } = params;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(
      "tripId:id, name, days (date, orderPlaces:order_places), currentDate:current_date, sharing, sharingId:sharing_id, timezone",
    )
    .eq("id", tripId)
    .order("date", { referencedTable: "days" })
    .limit(1);
  if (error) throw new Error("Couldn't get trip information.");

  const trip = mapDateRange(data).pop();
  if (!trip) throw new Error("Couldn't get trip information");

  return (
    <main className="flex flex-col items-center px-6 py-4">
      <h2 className="text-3xl">{trip.name}</h2>
      <div></div>
    </main>
  );
}
