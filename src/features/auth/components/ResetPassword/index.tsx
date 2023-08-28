"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ResetPasswordForm from "./SendEmailForm";
import { useEffect, useState } from "react";
import SendEmailForm from "./SendEmailForm";

export default function ResetPassword() {
  const [resetPassword, setResetPassword] = useState(false);

  const supabase = createClientComponentClient<any>();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event == "PASSWORD_RECOVERY") {
        setResetPassword(true);
      } else setResetPassword(false);
    });
  }, [supabase.auth]);

  return (
    <section className="max-w-xl flex-col space-y-10 p-20">
      <div className="space-y-6 text-center ">
        <h1 className=" text-4xl">
          {!resetPassword ? "Forgot your password?" : "Create a new password."}
        </h1>
        <h2 className="text-xl">
          {!resetPassword
            ? "Enter your email and we'll send you a link to reset it."
            : "Enter a strong password you'll remember."}
        </h2>
      </div>
      {resetPassword ? <ResetPasswordForm /> : <SendEmailForm />}
    </section>
  );
}
