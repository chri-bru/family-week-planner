import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '$app/env/private';

if (DATABASE_URL === undefined) {
	throw new Error('DATABASE_URL environment variable is not set');
}

export const pg = drizzle(DATABASE_URL);
