import Login from "@/features/auth/components/Login";
import SignUp from "@/features/auth/components/SignUp";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="flex justify-between bg-emerald-600 px-4 py-2 text-gray-50">
        <Link href="/" className="text-4xl font-bold">
          Journey
        </Link>
        <div className="flex gap-8">
          <Login />
          <SignUp />
        </div>
      </header>
    </>
  );
}
