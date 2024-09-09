"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <img
          src="./sad_cat_potato.jpg"
          className="mb-4 w-full max-w-md rounded-full"
          alt="A sad cat that is a potato"
        />
        <h2 className="text-3xl">Something went wrong!</h2>
        <p className="max-w-lg text-xl">{error.message}</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button onClick={() => reset()} className="text-lg">
          Try again
        </Button>
        <span className="text-sm">or</span>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    </div>
  );
}
