import { integer, pgTable, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
	id: text('id').primaryKey(),
	name: text('name'),
	email: text('email'),
	emailVerified: boolean('email_verified').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
	// image
});

export const familyPlanTable = pgTable('family_plans', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 256 }).notNull(),
	createdAt: timestamp('created_at').defaultNow()
});

export const memberTable = pgTable('members', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	family: integer().references(() => familyPlanTable.id),
	user: text().references(() => user.id)
});

export type User = typeof user.$inferSelect;
export type Family = typeof familyPlanTable.$inferSelect;
export type Member = typeof memberTable.$inferSelect;
