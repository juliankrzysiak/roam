const features = [
  "Quickly create a scheduled itinerary for a fun day trip or an exciting journey across the states.",
  "Get a bird's eye view of your trip. See all your stops on a map, know when your day will end, and see how many miles you'll go.",
  "Print our trip details when you're done for those remote destinations.",
  "Enjoy planning your trips for free!",
];

export default function Features() {
  return (
    <section className="flex w-full flex-col items-center gap-8 bg-emerald-900 px-8 py-12 shadow-lg">
      <h3 className="text-center font-display text-4xl text-slate-100 md:text-5xl">
        with <span className="font-bold">roam</span> you can
      </h3>
      <ul className="grid w-full grid-cols-magic gap-12 text-xl xl:py-8">
        {features.map((feature) => {
          return (
            <li
              key={feature}
              className="topography max-w-md rounded-lg bg-slate-100 px-6 py-4 text-slate-900 shadow-inner"
            >
              <p>{feature}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
