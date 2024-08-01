import Link from "next/link";

export default function Action() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-display text-7xl text-emerald-950">
          All Roads Lead to <span className="text-8xl">roam</span>
        </h2>
        <h3 className="text-5xl">Try it out today</h3>
      </div>
      <Link
        href={"/map"}
        className="w-fit rounded-lg bg-emerald-900 p-4 text-2xl font-bold text-gray-100"
      >
        Plan your trip
      </Link>
    </section>
  );
}
