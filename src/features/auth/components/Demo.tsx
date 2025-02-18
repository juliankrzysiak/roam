"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

export default function Demo() {
  const router = useRouter();
  const { toast } = useToast();

  const supabase = createClient();

  async function submitForm() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      toast({ title: "You already have an account." });
      return;
    }
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw new Error(error.message);

    router.push("/trips");
    router.refresh();
  }

  return (
    <form action={submitForm}>
      <Submit text="Try the Demo" />
    </form>
  );
}

type SubmitProps = {
  text: string;
};

function Submit({ text }: SubmitProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      className="border-emerald-50 text-sm text-emerald-50 opacity-75 lg:bg-emerald-100 lg:text-emerald-950 lg:opacity-100"
    >
      {pending ? <LoaderCircle className="animate-spin" /> : text}
    </Button>
  );
}
