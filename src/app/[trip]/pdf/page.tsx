import DownloadLink from "@/features/pdf/components/DownloadLink";
import Viewer from "@/features/pdf/components/Viewer";
import { getDay } from "@/utils/actions/crud/get";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: { trip: string };
};

export default async function PDFPage({ params }: Props) {
  const { trip: tripId } = params;
  const supabase = createClient();

  const { data, error } = await supabase
    .from("days")
    .select("id, date")
    .eq("trip_id", tripId);
  if (error) return;
  const sortedDays = data.map((day) => day.date).sort();

  const days = await Promise.all(
    sortedDays.map(async (date) => {
      const day = await getDay(supabase, tripId, date);
      return day;
    }),
  );

  return (
    <main className="flex w-full flex-grow">
      <DownloadLink days={days} />
      <Viewer days={days} />
    </main>
  );
}
