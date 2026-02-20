import { pgTable, timestamp, text } from 'drizzle-orm/pg-core';
import { user } from './users';

export const sessionTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	token: text('token'),
	ipAddress: text('ip_address'),
	userAgent: text('userAgent')
});

export type Session = typeof sessionTable.$inferSelect;
