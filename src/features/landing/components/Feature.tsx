import Image from "next/image";
import mapMarker from "@/../public/map-marker-solid.svg";

interface Props {
  children: string;
}

export default function Feature({ children }: Props) {
  return (
    <article className="flex items-center gap-4">
      <Image src={mapMarker} width={40} alt="Map Marker" />
      <p className="text-2xl">{children}</p>
    </article>
  );
}
