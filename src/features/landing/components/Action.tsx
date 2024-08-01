import { Button } from "@/components/ui/button";
import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { useSetAtom } from "jotai";
import Link from "next/link";

export default function Action() {
  const setOpen = useSetAtom(isSignUpFormVisibleAtom);

  return (
    <section className="mb-12 flex flex-col items-center justify-center gap-8 px-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-display text-6xl text-emerald-950">
          All Roads Lead to <span className="text-8xl font-medium">roam</span>
        </h2>
      </div>
      <Button
        className="h-full w-full max-w-lg py-2  text-2xl text-slate-100"
        onClick={() => setOpen(true)}
      >
        Start planning today
      </Button>
    </section>
  );
}
