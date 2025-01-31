"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { signOut } from "@/utils/actions/auth";
import { LogOut } from "lucide-react";

export default function SignOut() {
  return (
    <DropdownMenuItem
      onSelect={async () => {
        await signOut();
        toast({ title: "You've been signed out." });
      }}
    >
      <button className="flex items-center justify-between gap-2">
        <LogOut size={18} />
        Sign Out
      </button>
    </DropdownMenuItem>
  );
}
