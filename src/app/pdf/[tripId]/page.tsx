import { getDay } from "@/app/[tripId]/page";
import { createClient } from "@/utils/supabase/server";
import { FileText } from "lucide-react";
import dynamic from "next/dynamic";

const PDFDeviceCheck = dynamic(
  () => import("@/features/pdf/components/PDFDeviceCheck"),
  {
    ssr: false,
    loading: () => <FileText className="animate-bounce" size={72} />,
  },
);

type Props = {
  params: { tripId: string };
};

export default async function PDFPage({ params }: Props) {
  const { tripId } = params;
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("No authorization.");
  const { data, error } = await supabase
    .from("days")
    .select("id, date, timezone")
    .eq("trip_id", tripId)
    .order("date");
  if (error) throw new Error("Could not load places.");

  const days = await Promise.all(
    data.map(async ({ date, timezone }) => {
      const day = await getDay(tripId, timezone, date);
      return day;
    }),
  );

  return (
    <main className="grid flex-1 place-items-center">
      <PDFDeviceCheck days={days} />
    </main>
  );
}
