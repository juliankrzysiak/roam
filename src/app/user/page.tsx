import AccountTabs from "@/features/user/components/AccountTabs";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function User() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user || error) throw new Error(error?.message);
  const name = user.user_metadata.name;
  const email = user.email ?? "";

  return (
    <main className="flex flex-col items-center px-8 py-4">
      <h1 className="mb-4 text-2xl">Account Settings</h1>
      <AccountTabs name={name} email={email} />
    </main>
  );
}
