import PDF from "@/features/pdf/components/PDF";
import { getDay } from "@/utils/actions/crud/get";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: { trip: string };
};

export default async function PDFPage({ params }: Props) {
  const { trip: tripId } = params;
  const supabase = createClient();

  const day = await getDay(supabase, tripId);

  return (
    <main className="flex w-full flex-grow">
      <PDF day={day} />
    </main>
  );
}
