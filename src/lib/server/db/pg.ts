import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { env } from '$env/dynamic/private';
import path from 'path';

export const pg = drizzle(env.DATABASE_URL);

export async function migrateAfterClientReady() {
	await migrate(pg, {
		migrationsFolder: path.resolve('drizzle'), // set to your drizzle generated path
		migrationsSchema: path.resolve('src/lib/server/db/schema'),
		migrationsTable: '__migrations'
	});
}

if (env.SETUP_DB) migrateAfterClientReady();
