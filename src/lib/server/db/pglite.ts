import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { PGlite } from '@electric-sql/pglite';
import { env } from '$env/dynamic/private';
import path from 'path';

const usesInMemoryDB = !env.DATABASE_URL;
// use in-memory pglite if no url is set
const client = usesInMemoryDB ? new PGlite() : new PGlite(env.DATABASE_URL);

export const pglite = drizzle(client);

export async function migrateAfterClientReady() {
	if (!client.ready) await client.waitReady;
	await migrate(pglite, {
		migrationsFolder: path.resolve('drizzle'), // set to your drizzle generated path
		migrationsSchema: path.resolve('src/lib/server/db/schema'),
		migrationsTable: '__migrations'
	});
}

migrateAfterClientReady();
