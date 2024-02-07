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
import Link from "next/link";
import { signOut } from "@/utils/actions";

export default function User() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>User</DropdownMenuTrigger>
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
