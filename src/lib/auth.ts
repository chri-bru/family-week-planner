import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './server/db/db';
import { user } from './server/db/schema/users';
import { sessionTable } from './server/db/schema/sessions';
import { accountTable } from './server/db/schema/accounts';
import { verificationTable } from './server/db/schema/verifications';
import { passkeyTable } from './server/db/schema/passkeys';
import { BETTER_AUTH_URL } from '$app/env/private';

export const auth = betterAuth({
	baseURL: BETTER_AUTH_URL,
	emailAndPassword: { enabled: true },
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user,
			session: sessionTable,
			account: accountTable,
			verification: verificationTable,
			passkey: passkeyTable
		}
	}),
	plugins: [passkey()]
});
