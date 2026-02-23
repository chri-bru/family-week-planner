import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '$env/dynamic/private';

if (env.DATABASE_URL === undefined) {
	throw new Error('DATABASE_URL environment variable is not set');
}

export const pg = drizzle(env.DATABASE_URL);
