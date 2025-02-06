"use client";

import clsx from "clsx";
import { useIntersection } from "../hooks";

type FeaturesProps = {
  features: { title: string; content: string }[];
};

export function Features({ features }: FeaturesProps) {
  return (
    <div className="w-full bg-emerald-950 px-4 py-12">
      <ul className="mx-auto grid w-full place-content-center place-items-center gap-12 sm:grid-cols-2">
        {features.map(({ title, content }, i) => {
          return <Feature key={i} title={title} content={content} />;
        })}
      </ul>
    </div>
  );
}

type FeatureProps = {
  title: string;
  content: string;
};

function Feature({ title, content }: FeatureProps) {
  const [intersectionRef, isVisible] = useIntersection({
    threshold: 0.75,
    once: true,
  });
  return (
    <li
      key={title}
      className="flex h-full max-w-2xl flex-col gap-2 text-center text-emerald-50"
    >
      <h3
        ref={intersectionRef}
        className={clsx(
          isVisible && "fade-in-right opacity-100",
          "font-display text-5xl font-bold opacity-0 sm:text-6xl",
        )}
      >
        {title}
      </h3>
      <p className="text-emerald-100 lg:text-xl">{content}</p>
    </li>
  );
}
