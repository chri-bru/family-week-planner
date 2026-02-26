import { integer, pgTable, varchar, timestamp, text, uuid } from 'drizzle-orm/pg-core';
import { user } from './users';
import { randomUUID } from 'node:crypto';

export const familyPlanTable = pgTable('family_plan', {
    id: text().primaryKey().$default(() => randomUUID()),
    name: varchar({ length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const memberTable = pgTable('member', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    family: text().references(() => familyPlanTable.id),
    user: text().references(() => user.id),
    createdAt: timestamp('created_at').defaultNow()
});

export type Family = typeof familyPlanTable.$inferSelect;
export type Member = typeof memberTable.$inferSelect;
