import { pgTable, timestamp, text, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name'),
	email: text('email'),
	emailVerified: boolean('email_verified').default(false),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export type User = typeof user.$inferSelect;
