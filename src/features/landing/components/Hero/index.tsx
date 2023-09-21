import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center gap-12">
      <div className="flex flex-col gap-4">
        <h1 className=" text-center text-7xl">Explore the World</h1>
        <h2 className=" text-center text-4xl">
          Simplicity and ease in planning your adventures.
        </h2>
      </div>
      <Link
        href={"/map"}
        className="w-fit rounded-lg bg-emerald-900 p-4 text-2xl font-bold text-gray-100"
      >
        Start planning
      </Link>
    </section>
  );
}
