import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './server/db/db';

// TODO add mail verification
export const auth = betterAuth({
	emailAndPassword: {
		enabled: true
	},
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	plugins: [passkey()]
});
