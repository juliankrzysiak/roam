import Link from "next/link";
import Nav from "./Nav";

export default function Header() {
  return (
    <header className="flex justify-between p-4 ">
      <Link href="/" className="text-3xl text-emerald-900">
        ROAM
      </Link>
      <Nav />
    </header>
  );
}
