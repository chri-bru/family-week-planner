import { integer, pgTable, text, date, pgEnum } from 'drizzle-orm/pg-core';
import { familyPlanTable } from './users';

export const mealType = pgEnum('type', ['breakfast', 'dinner', 'lunch', 'special', 'snack']);

export const meal = pgTable('meal', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	date: date().notNull().defaultNow(),
	type: mealType(),
	family: integer().references(() => familyPlanTable.id)
});

export type Meal = typeof meal.$inferSelect;
