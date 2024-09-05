"use client";

import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl">Something went wrong!</h2>
        <h3 className="text-xl">{error.message}</h3>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button onClick={() => reset()}>Try again</Button>
        <span className="text-sm">or</span>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    </div>
  );
}
