import { getDay } from "@/app/planner/[tripId]/page";
import { createClient } from "@/utils/supabase/server";
import { FileText } from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Print",
};

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

  const { data: tripName, error: tripNameError } = await supabase
    .from("trips")
    .select("name")
    .eq("id", tripId)
    .limit(1)
    .single();
  if (tripNameError) throw new Error(tripNameError.message);

  return (
    <main className="grid flex-1 place-items-center">
      <PDFDeviceCheck days={days} tripName={tripName.name} />
    </main>
  );
}
