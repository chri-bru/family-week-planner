import { integer, pgTable, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { user } from './users';

export const familyPlanTable = pgTable('family_plan', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const memberTable = pgTable('member', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    family: integer().references(() => familyPlanTable.id),
    user: text().references(() => user.id),
    createdAt: timestamp('created_at').defaultNow()
});

export type Family = typeof familyPlanTable.$inferSelect;
export type Member = typeof memberTable.$inferSelect;
