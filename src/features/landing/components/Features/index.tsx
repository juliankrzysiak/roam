export default function Features() {
  return (
    <section className=" grid gap-10 text-center text-2xl lg:grid-cols-2  lg:text-3xl">
      <article className="max-w-lg rounded-lg bg-emerald-900 p-10 text-gray-100 lg:col-span-2">
        <p>
          Quickly create a scheduled itinerary for a fun day trip or an exciting
          journey across the states.
        </p>
      </article>
      <article className="max-w-lg rounded-lg  bg-gray-200 p-10 text-emerald-900 lg:col-start-2">
        <p>
          Get a bird&apos;s eye view of your trip. See all your stops on a map,
          find out how many miles you&apos;ll go, know what the trip will cost,
          and more.
        </p>
      </article>
      <article className="max-w-lg rounded-lg bg-emerald-900 p-10 text-gray-100 lg:col-span-2">
        <p>
          Add your favorite places to lists. When you&apos;re done, simply drag
          and drop them into your schedule.
        </p>
      </article>
      <article className="max-w-lg rounded-lg bg-gray-200 p-10 text-emerald-900 lg:col-start-2">
        <p>
          Free to use, no account required. Or create one to save everything for
          future inspiration!
        </p>
      </article>
    </section>
  );
}
