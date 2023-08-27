import Login from "@/features/auth/components/Login";
import SignUp from "@/features/auth/components/SignUp";

export default function Header() {
  return (
    <>
      <header className="flex justify-between bg-emerald-600 px-4 py-2 text-gray-50">
        <h2 className="text-4xl font-bold">Journey</h2>
        <div className="flex gap-6">
          <Login />
          <SignUp />
        </div>
      </header>
    </>
  );
}
