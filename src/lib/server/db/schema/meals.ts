import { integer, pgTable, text, date, pgEnum } from 'drizzle-orm/pg-core';
import { familyPlanTable } from './family-plans';

export const mealType = pgEnum('meal_type', ['breakfast', 'dinner', 'lunch', 'special', 'snack']);

export const meal = pgTable('meal', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	date: date().notNull().defaultNow(),
	link: text(),
	type: mealType(),
	family: integer().references(() => familyPlanTable.id)
});

export type Meal = typeof meal.$inferSelect;
