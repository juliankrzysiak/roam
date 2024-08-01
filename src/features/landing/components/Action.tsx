import { Button } from "@/components/ui/button";
import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { useSetAtom } from "jotai";

export default function Action() {
  const setOpen = useSetAtom(isSignUpFormVisibleAtom);

  return (
    <section className="mb-12 flex flex-col items-center justify-center gap-8  px-8 py-36 text-center">
      <div className="relative flex flex-col items-center gap-4">
        <h2 className="font-display text-6xl text-emerald-950">
          All Roads Lead to <br />
          <span className="text-8xl font-medium">roam</span>
        </h2>

        <div className="absolute top-1/2 -z-10 flex w-[3000px] rotate-45 flex-col gap-4 opacity-25 blur-[1px]">
          <div className="flex h-12 w-full items-center border-y-2 border-slate-900">
            <hr className="w-full  border-2 border-dashed border-slate-900" />
          </div>
          <div className="flex h-12 w-full items-center border-y-2 border-slate-900">
            <hr className="w-full  border-2 border-dashed border-slate-900" />
          </div>
        </div>
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
