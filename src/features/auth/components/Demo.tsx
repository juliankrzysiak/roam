"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Demo() {
  const router = useRouter();
  const supabase = createClient();

  async function handleClick() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase.auth.signInAnonymously();

    try {
      if (user) throw new Error("You already have an account.");
      if (error) throw new Error(error.message);

      router.push("/trips");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button variant="outline" className="text-sm" onClick={handleClick}>
      Try it out
    </Button>
  );
}
