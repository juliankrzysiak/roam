import Login from "@/features/auth/components/Login";
import { useRef } from "react";

export default function Header() {
  return (
    <>
      <header className="flex justify-between bg-emerald-600 px-4 py-2 text-gray-50">
        <h2 className="text-4xl font-bold">Journey</h2>
        <Login />
      </header>
    </>
  );
}
