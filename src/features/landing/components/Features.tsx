type Props = {
  features: string[];
};

export default function Features({ features }: Props) {
  return (
    <ul className="grid w-full max-w-2xl grid-cols-magic gap-12 text-center text-xl xl:py-8">
      {features.map((feature) => {
        return (
          <li
            key={feature}
            className="topography flex max-w-md items-center rounded-lg bg-slate-100 px-6 py-4 text-slate-900 shadow-inner"
          >
            <p className="text-center">{feature}</p>
          </li>
        );
      })}
    </ul>
  );
}
