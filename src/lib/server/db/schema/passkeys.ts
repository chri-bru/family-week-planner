import { integer, pgTable, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { user } from './users';

export const passkeyTable = pgTable('passkey', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => user.id),
	name: text('name'),
	publicKey: text('public_key'),
	credentialId: text('credential_id'),
	counter: integer('counter'),
	deviceType: text('device_type'),
	backedUp: boolean('backed_up'),
	transports: text('transports'),
	aaguid: text('aaguid'),
	createdAt: timestamp('created_at').defaultNow()
});

export type Passkey = typeof passkeyTable.$inferSelect;
