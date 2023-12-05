import Review from "./Review";

const reviews = [
  {
    name: "Julian Krzysiak",
    review:
      "Really great service they have, and for free? How fo they do it? Must have taken them a while to make something like this.",
  },
  {
    name: "Mike Wazowski",
    review: "Whenver I need to plan a road trip, I stick with ROAM.",
  },
  {
    name: "Kulian Jrzysiak",
    review:
      "Amazing! Try it out, you don't wanna miss it. Please try it out. Please...",
  },
];

export default function Testimonials() {
  return (
    <section className="grid gap-10  text-xl">
      {reviews.map((review) => (
        <Review key={review.name} name={review.name} review={review.review} />
      ))}
    </section>
  );
}
