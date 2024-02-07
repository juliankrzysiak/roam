"use client";

import SignOutSVG from "@/assets/sign-out.svg";
import UserSVG from "@/assets/user.svg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/utils/actions";
import Link from "next/link";


type Props = {
  name: string;
};

export default function User({ name }: Props) {
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
        <DropdownMenuItem>
          <Link
            href="/user"
            className="flex items-center justify-between gap-2"
          >
            <UserSVG className="h-6 w-6" /> <p>My Account</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
        >
          <span className="flex items-center justify-between gap-2">
            <SignOutSVG className="h-6 w-6" />
            <p>Sign Out</p>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
