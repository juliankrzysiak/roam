import AccountTabs from "@/features/user/components/AccountTabs";
import SignUpButton from "@/features/user/components/SignUpButton";
import { createClient } from "@/utils/supabase/server";

export default async function User() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user || error) throw new Error(error?.message);
  const name: string = user.user_metadata.name ?? "";
  const email = user.email ?? "";
  const isAnonymous = Boolean(user.is_anonymous);

  return (
    <main className="flex flex-col items-center px-8 py-4">
      <h1 className="mb-4 text-2xl">Account Settings</h1>
      <AccountTabs name={name} email={email} isAnonymous={isAnonymous} />
      {isAnonymous && <SignUpButton />}
    </main>
  );
}
