"use client";

import Link from "next/link";
import Nav from "./Nav";

export default function Header() {
  return (
    <header className="flex justify-between bg-emerald-600 px-4 py-2 text-gray-50">
      <Link href="/" className="text-4xl font-bold">
        Journey
      </Link>
      <Nav />
    </header>
  );
}
