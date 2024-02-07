import Link from "next/link";
import User from "./User";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import SignIn from "./SignIn";

export default async function Header() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.getSession();
  const user = data.session?.user;

  return (
    <header className="flex justify-between bg-emerald-800 p-4">
      <nav className="flex">
        <Link href="/" className="text-3xl text-emerald-50">
          ROAM
        </Link>
        <Link href="/trips" className="text-xl text-emerald-50">
          Trips
        </Link>
        <Link href="#" className="text-xl text-emerald-50">
          Places
        </Link>
      </nav>
      {user ? <User /> : <SignIn />}
    </header>
  );
}
