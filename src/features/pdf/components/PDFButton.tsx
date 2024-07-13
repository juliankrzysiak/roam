"use client";

import { File } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PDFButton() {
  const pathname = usePathname();
  return (
    <Link
      href={`${pathname}/pdf`}
      className="absolute right-10 top-20 rounded-full border-2 border-emerald-900 bg-slate-100 p-4"
    >
      <File />
    </Link>
  );
}
