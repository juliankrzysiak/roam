import Login from "@/features/auth/components/Login";
import SignUp from "@/features/auth/components/SignUp";

export default function SignIn() {
  return (
    <div className="flex gap-2 ">
      <Login />
      <SignUp />
    </div>
  );
}
