import { getDay } from "@/utils/actions/crud/get";
import { createClient } from "@/utils/supabase/server";
import { FileText, Map } from "lucide-react";
import dynamic from "next/dynamic";

const PDFDeviceCheck = dynamic(
  () => import("@/features/pdf/components/PDFDeviceCheck"),
  {
    ssr: false,
    loading: () => <FileText className="animate-bounce" size={72} />,
  },
);

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
    <main className="grid flex-1 place-items-center">
      <PDFDeviceCheck days={days} />
    </main>
  );
}
