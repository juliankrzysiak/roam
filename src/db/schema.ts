import {
  pgTable,
  smallint,
  timestamp,
  uuid,
  doublePrecision,
  bigint,
  text,
  date,
  unique
} from "drizzle-orm/pg-core";
 import { sql } from "drizzle-orm"

export const places = pgTable("places", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text("name"),
	category: text("category"),
	lng: doublePrecision("lng").notNull(),
	lat: doublePrecision("lat").notNull(),
	duration: smallint("duration").default(0).notNull(),
	id: uuid("id").primaryKey().notNull(),
	dayId: uuid("day_id").notNull().references(() => days.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		placesIdKey: unique("places_id_key").on(table.id),
	}
});

export const days = pgTable("days", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	date: date("date"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tripId: bigint("trip_id", { mode: "number" }).notNull().references(() => trips.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	startTime: text("start_time"),
	orderPlaces: uuid("order_places").default(sql`'{}'`).array(),
	id: uuid("id").defaultRandom().primaryKey().notNull(),
},
(table) => {
	return {
		daysUuidKey: unique("days_uuid_key").on(table.id),
	}
});

export const trips = pgTable("trips", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").default(sql`auth.uid()`),
	name: text("name").notNull(),
	dayId: uuid("day_id"),
	orderDays: uuid("order_days").default(sql`'{}'`).array().notNull(),
},
(table) => {
	return {
		tripsIdKey: unique("trips_id_key").on(table.id),
	}
});