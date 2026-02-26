import { integer, pgTable, text, date, pgEnum } from 'drizzle-orm/pg-core';
import { familyPlanTable } from './family-plans';

const mealTypes = ['breakfast', 'dinner', 'lunch', 'special', 'snack'] as const;

export const mealType = pgEnum('meal_type', mealTypes);

export const meal = pgTable('meal', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	date: date().notNull().defaultNow(),
	link: text(),
	type: mealType().default('dinner').notNull(),
	family: integer().references(() => familyPlanTable.id)
});

export type Meal = typeof meal.$inferSelect;
export type MealType = typeof mealTypes[number]