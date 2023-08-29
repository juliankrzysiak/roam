"use client";

import Login from "@/features/auth/components/Login";
import SignUp from "@/features/auth/components/SignUp";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const renderNav = () => {
    switch (pathname) {
      case "/":
        return (
          <>
            <Login />
            <SignUp />
          </>
        );

      default:
        break;
    }
  };

  return <nav className="flex gap-8">{renderNav()} </nav>;
}
