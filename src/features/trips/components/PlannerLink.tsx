"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  tripId: string;
};

export default function PlannerLink({ tripId }: Props) {
  function handleClick() {
    localStorage.setItem("tripId", tripId);
  }

  return (
    <Button variant="default" className="w-full" asChild onClick={handleClick}>
      <Link href={`/planner/${tripId}`}>Start planning</Link>
    </Button>
  );
}
