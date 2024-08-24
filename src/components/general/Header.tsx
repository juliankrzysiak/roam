import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Login from "@/features/auth/components/Login";
import Signup from "@/features/auth/components/SignUp";
import { signOut } from "@/utils/actions/auth";
import { createClient } from "@/utils/supabase/server";
import { LogOut, UserIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import Nav from "./Nav";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieTripId = cookies().get("tripId")?.value;

  return (
    <header className="flex justify-between bg-emerald-900 p-4">
      <Nav user={user} cookieTripId={cookieTripId}  />
      {user ? (
        <User name={user.user_metadata.name} />
      ) : (
        <div className="flex gap-4 text-slate-100">
          <Login />
          <Signup />
        </div>
      )}
    </header>
  );
}

type UserProps = {
  name?: string;
};

function User({ name }: UserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="text-emerald-50"
        aria-label="Open dropdown menu for account"
      >
        <div className="border-slate-00 grid aspect-square h-8 place-content-center  rounded-full border-2 ">
          {name ? name.substring(0, 1).toUpperCase() : <UserIcon size={18} />}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href="/user"
            className="flex items-center justify-between gap-2"
          >
            <UserIcon size={18} /> My Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOut}>
            <button className="flex items-center justify-between gap-2">
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
