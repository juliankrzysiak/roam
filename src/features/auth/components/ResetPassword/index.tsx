"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import SendEmailForm from "./SendEmailForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPassword() {
  const [showPasswordResetForm, setShowResetPassword] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        setShowResetPassword(true);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <section className="max-w-xl flex-col space-y-10 p-20">
      <div className="space-y-6 text-center ">
        <h1 className=" text-4xl">
          {showPasswordResetForm
            ? "Create a new password."
            : "Forgot your password?"}
        </h1>
        <h2 className="text-xl">
          {showPasswordResetForm
            ? "Enter a strong password you'll remember."
            : "Enter your email and we'll send you a link to reset it."}
        </h2>
      </div>
      {showPasswordResetForm ? <ResetPasswordForm /> : <SendEmailForm />}
    </section>
  );
}
