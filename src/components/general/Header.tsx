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
import { LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import Nav from "./Nav";

export default async function Header() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  return (
    <header className="flex justify-between bg-emerald-800 p-4">
      <Nav user={user} />
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
        <div className="border-slate-00 grid aspect-square h-8 place-content-center  rounded-full border-2 ">
          {letter ?? <UserIcon size={18} />}
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
