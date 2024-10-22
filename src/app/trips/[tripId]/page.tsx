import { Button } from "@/components/ui/button";
import ShareTrip from "@/features/trips/components/ShareTrip";
import TripOptions from "@/features/trips/components/TripOptions";
import { formatDateRange, formatTripData } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { ChevronLeft } from "lucide-react";
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
      "tripId:id, name, days (date, totalDuration:total_duration, totalDistance:total_distance, orderPlaces:order_places), currentDate:current_date, isSharing: is_sharing, sharingId:sharing_id, timezone",
    )
    .eq("id", tripId)
    .order("date", { referencedTable: "days" })
    .limit(1)
    .single();
  if (error) throw new Error("Couldn't get trip information.");
  const trip = formatTripData(data);
  const { name, dateRange, currentDate, sharing } = trip;
  const formattedRange = formatDateRange(dateRange, "EEE, MMM dd");

  return (
    <main className="mx-auto px-6 py-4">
      <div className="relative flex w-fit flex-col items-center rounded-md border-2 border-slate-300 bg-slate-100 px-12 py-4">
        <Link
          href="/trips"
          className="absolute left-2 top-2 text-sm text-slate-500"
        >
          <span className="flex items-center">
            <ChevronLeft size={16} /> back
          </span>
        </Link>
        <TripOptions
          tripId={tripId}
          name={name}
          dateRange={dateRange}
          currentDate={currentDate}
        />
        <h2 className="mb-2 text-3xl">{name}</h2>
        <div className="mb-4 flex flex-col gap-4">
          <span className="text-xl">{formattedRange}</span>
          <div className="flex gap-2 ">
            <ShareTrip
              tripId={tripId}
              sharing={sharing.isSharing}
              sharingId={sharing.sharingId}
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
        <div className="flex w-full flex-col items-center gap-2">
          <h3 className="text-xl">Totals</h3>
          <div className="flex w-full flex-col items-start gap-1">
            <span> Distance: </span>
            <span> Duration: </span>
            <span> Days: </span>
          </div>
        </div>
      </div>
    </main>
  );
}
