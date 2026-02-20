import { sql } from 'drizzle-orm';
import {
	varchar,
	pgTable,
	text,
	uuid,
	integer,
	pgEnum,
	boolean,
	check,
	date,
	timestamp,
	index
} from 'drizzle-orm/pg-core';
import { familyPlanTable, user } from './users';

// const commonTaskDefinition = {
// 	id: uuid().primaryKey().defaultRandom(),
// 	title: varchar({ length: 256 }).notNull(),
// 	description: text(),

// 	owner: integer().references(() => familyPlanTable.id),
// 	creator: integer().references(() => user.id)
// };

// /**
//  * Tasks (incl. one-off and recurring ones)
//  */
// export const task = pgTable('task', {
// 	...commonTaskDefinition,

// 	completed: boolean().default(false),
// 	completed_by: integer(), // references user.id

// 	start_date: date('start_date'), // first possible occurrence
// 	due_date: date('due_date'), // optional per-task due

// 	template: integer() // references reccurence.id if based on a recurring task
// });

// /**
//  * Recurring tasks that function as a task template
//  */
// export const frequencyEnum = pgEnum('frequency', ['day', 'week', 'month']);
// export const recurrence = pgTable(
// 	'recurrence',
// 	{
// 		...commonTaskDefinition,

// 		// intervall settings
// 		frequency: frequencyEnum().default('day'), // defines when the task should reocur
// 		interval: integer().notNull().default(1), // e.g. frequency: day, interval: 2 -> every 2nd day
// 		weekday: integer(), // maps to the day of the week
// 		monthday: integer(), // maps to the day of the month, -1 representing the end of the month
// 		paused: boolean().default(false),

// 		repeatUntil: date('repeat_until') // opt. repeat until a given day
// 	},
// 	(table) => [
// 		check('weekday_check', sql`${table.weekday} >= 0 AND ${table.weekday} < 8`),
// 		check('monthday_check', sql`${table.monthday} >= -1 AND ${table.weekday} < 32`)
// 	]
// );

// /**
//  * Task history to have a backlog of task events
//  */
// export const statusEnum = pgEnum('status', ['created', 'completed', 'paused', 'deleted']);
// export const history = pgTable(
// 	'task_history',
// 	{
// 		id: uuid().primaryKey().defaultRandom(),
// 		user: integer().references(() => user.id),
// 		family: integer().references(() => familyPlanTable.id),
// 		createdAt: timestamp('created_at').defaultNow(),
// 		title: text().notNull(),
// 		status: statusEnum().notNull()
// 	},
// 	(table) => [index('family_idx').on(table.family)]
// );

// export type Task = typeof task.$inferSelect;
// export type Recurrence = typeof recurrence.$inferSelect;
// export type History = typeof history.$inferSelect;
