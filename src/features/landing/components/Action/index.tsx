import Link from "next/link";

export default function Action() {
  return (
    <section className="flex min-h-[calc(100vh/2)] flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-7xl">All roads lead to ROAM</h1>
        <h2 className="text-5xl">Try it out today</h2>
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
