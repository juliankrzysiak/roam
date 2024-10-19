import { Button } from "@/components/ui/button";
import ShareTrip from "@/features/trips/components/ShareTrip";
import { formatDateRange, mapDateRange } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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

  const formattedRange = formatDateRange(trip.dateRange, "EEE, MMM dd");

  return (
    <main className="flex flex-col items-center px-6 py-4">
      <h2 className="mb-4 text-3xl">{trip.name}</h2>
      <div className="flex flex-col gap-2">
        <span className="text-xl">{formattedRange}</span>
        <div className="flex gap-2 ">
          <ShareTrip
            tripId={tripId}
            sharing={trip.sharing}
            sharingId={trip.sharingId}
          >
            <Button variant="outline" className="flex-1">
              Share
            </Button>
          </ShareTrip>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/pdf/${tripId}`}>Print</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
