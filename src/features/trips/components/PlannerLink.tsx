"use client";

import { Button } from "@/components/ui/button";
import { setCookie } from "@/utils/actions/cookies";
import { useRouter } from "next/navigation";

type Props = {
  tripId: string;
};

export default function PlannerLink({ tripId }: Props) {
  const router = useRouter();
  return (
    <form
      action={async () => {
        setCookie("tripId", tripId);
        router.push(`/planner/${tripId}`);
      }}
    >
      <Button className="text-md w-full rounded-none rounded-t" size="lg">
        Start Planning
      </Button>
    </form>
  );
}
