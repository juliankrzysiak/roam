"use client";

import { Button } from "@/components/ui/button";
import { updateCurrentDate } from "@/utils/actions/crud/update";
import { useRouter } from "next/navigation";

type Props = { tripId: string; date: Date };

export default function GoToDateButton({ tripId, date }: Props) {
  const router = useRouter();
  async function handleClick() {
    await updateCurrentDate(tripId, date);
    router.push(`/planner/${tripId}`);
  }

  return <Button onClick={handleClick}>Go To Date</Button>;
}
