import {
  pgTable,
  serial,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  user_id: uuid("user_id"),
  orderDays: uuid("order_days").array(),
  currentDayIndex: smallint("current_day_index"),
  createdAt: timestamp("created_at").defaultNow(),
});
