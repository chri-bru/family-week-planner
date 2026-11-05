import { sql } from 'drizzle-orm';
import {
	varchar,
	pgTable,
	text,
	integer,
	pgEnum,
	date,
	timestamp,
	index,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { familyPlanTable } from './family-plans';
import { user } from './users';

const choreFrequencies = ['weekly', 'monthly', 'quarterly', 'half_yearly', 'yearly'] as const;

export const choreFrequency = pgEnum('chore_frequency', choreFrequencies);

export const chore = pgTable(
	'chore',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		family: text()
			.notNull()
			.references(() => familyPlanTable.id),
		title: varchar({ length: 256 }).notNull(),
		description: text(),
		frequency: choreFrequency().notNull(),
		startDate: date('start_date').notNull(),
		nextDueDate: date('next_due_date').notNull(),
		assignedTo: text('assigned_to').references(() => user.id),
		createdBy: text('created_by').references(() => user.id),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('chore_family_idx').on(table.family)]
);

export const task = pgTable(
	'task',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		family: text()
			.notNull()
			.references(() => familyPlanTable.id),
		chore: integer('chore_id').references(() => chore.id, { onDelete: 'cascade' }),
		title: varchar({ length: 256 }).notNull(),
		description: text(),
		dueDate: date('due_date'),
		assignedTo: text('assigned_to').references(() => user.id),
		completedAt: timestamp('completed_at'),
		completedBy: text('completed_by').references(() => user.id),
		createdBy: text('created_by').references(() => user.id),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('task_family_due_idx').on(table.family, table.dueDate),
		index('task_chore_idx').on(table.chore),
		uniqueIndex('task_pending_chore_unique')
			.on(table.chore)
			.where(sql`${table.completedAt} IS NULL`)
	]
);

export type Chore = typeof chore.$inferSelect;
export type NewChore = typeof chore.$inferInsert;
export type Task = typeof task.$inferSelect;
export type NewTask = typeof task.$inferInsert;
export type ChoreFrequency = (typeof choreFrequencies)[number];
