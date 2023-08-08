import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-10">
      <section className="w-fit text-center">
        <h1 className="my-6 text-7xl">Explore the World</h1>
        <h2 className="mb-8 text-4xl">
          Simplicity and ease in planning your adventures.
        </h2>
        <Button className="text-2xl">Get started</Button>
      </section>
      <section></section>
    </main>
  );
}
