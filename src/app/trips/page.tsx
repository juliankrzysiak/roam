import { createSupabaseServerClient } from "@/utils/supabaseServerClient";

export default async function Trips() {
  const supabase = createSupabaseServerClient();
  const { data: trips, error } = await supabase.from("trips").select();
  // TODO: Create error boundary
  if (error) return <div>error</div>;
  return (
    <div>
      <h1>trips</h1>
    </div>
  );
}
