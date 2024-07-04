import Link from "next/link";
import SignOutSVG from "@/assets/sign-out.svg";
import UserSVG from "@/assets/user.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Login from "@/features/auth/components/Login";
import SignUp from "@/features/auth/components/SignUp";
import { signOut } from "@/utils/actions/auth";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.getSession();
  const user = data.session?.user;

  return (
    <header className="flex justify-between bg-emerald-800 p-4">
      <nav className="flex items-baseline gap-4">
        <Link href="/" className="text-2xl text-emerald-50">
          ROAM
        </Link>
        {user && (
          <>
            <Link href="/trips" className="text-xl text-emerald-50">
              Trips
            </Link>
            <Link href="#" className="text-xl text-emerald-50">
              Places
            </Link>
          </>
        )}
      </nav>
      {user ? (
        <User name={user?.user_metadata.name} />
      ) : (
        <div className="flex gap-2 ">
          <Login />
          <SignUp />
        </div>
      )}
    </header>
  );
}

type UserProps = {
  name: string;
};

function User({ name }: UserProps) {
  const letter = name.substring(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="text-emerald-50"
        aria-label="Open dropdown menu for account"
      >
        <div className="border-slate-00 grid aspect-square h-8 place-content-center  rounded-full border ">
          <p>{letter ?? ":)"}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href="/user"
            className="flex items-center justify-between gap-2"
          >
            <UserSVG className="h-6 w-6" /> <p>My Account</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="flex items-center justify-between gap-2">
            <SignOutSVG className="h-6 w-6" />
            <p>Sign Out</p>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
