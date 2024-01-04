import "./styles.module.css";

type Props = {
  distance: number;
  duration: number;
};
export default function Trip({ distance, duration }: Props) {
  return (
    <div>
      <span>Distance {distance}</span>
      <span>Duration {duration}</span>
    </div>
  );
}
