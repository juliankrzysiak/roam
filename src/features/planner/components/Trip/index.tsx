import { TripInfo } from "@/types";
import styles from "./styles.module.css";

export default function Trip({ distance, duration }: TripInfo) {
  return (
    <div className={styles.container}>
      <span>Duration: {duration} minutes</span>
      <span>Distance: {distance} miles</span>
    </div>
  );
}
