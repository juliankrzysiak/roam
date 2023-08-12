import { Button } from "@/components/ui/button";
import Image from "next/image";
import mapMarker from "../../public/map-marker-solid.svg";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-36 p-20">
      <section className=" w-fit text-center">
        <h1 className="my-6 text-7xl">Explore the World</h1>
        <h2 className="mb-8 text-4xl">
          Simplicity and ease in planning your adventures.
        </h2>
        <Button className="text-2xl">Get started</Button>
      </section>
      <section className="flex flex-col gap-20">
        <article className="flex items-center gap-4">
          <Image src={mapMarker} width={40} alt="Map Marker" />
          <p className=" text-xl">
            Quickly create a scheduled itinerary for a fun day trip, or an
            exciting journey across the states.
          </p>
        </article>
        <article className="flex items-center gap-4 pl-10">
          <Image src={mapMarker} width={40} alt="Map Marker" />
          <p className=" text-xl">
            Create lists of your favorite places. When you’re done, simply drag
            and drop them into your schedule.
          </p>
        </article>
        <article className="flex items-center gap-4">
          <Image src={mapMarker} width={40} alt="Map Marker" />
          <p className=" text-xl">
            Free to use, no account required. Or create one to save everything
            for future inspiration!
          </p>
        </article>
      </section>
      <section>
        <h1 className="my-6 text-7xl">Testimonials</h1>
        asdasd asdas
      </section>
    </main>
  );
}
