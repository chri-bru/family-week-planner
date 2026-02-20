import { and, eq, inArray } from 'drizzle-orm';
import { pglite } from '../pglite';
import { user, familyPlanTable, memberTable } from '../schema/users';

/**
 * Queries existing users
 */
export async function findUser(id: number) {
	return await pglite.select().from(user).where(eq(user.kc_id, id));
}

/**
 * Creates a user
 */
export async function createUser(id: string, kc_id: number, username: string) {
	return await pglite
		.insert(user)
		.values({
			id,
			kc_id,
			username
		})
		.returning();
}

/**
 * Create a family plan and optionally add initial members.
 * This runs in a transaction to keep member table consistent.
 */
export async function createPlan(planName: string, memberIds?: number[]) {
	return await pglite.transaction(async (tx) => {
		const [familyRow] = await tx
			.insert(familyPlanTable)
			.values({
				name: planName
			})
			.returning();

		if (memberIds && memberIds.length > 0) {
			const memberRows = memberIds.map((userId) => ({
				family: familyRow.id,
				member: userId
			}));
			await tx.insert(memberTable).values(memberRows);
		}

		return familyRow;
	});
}

/**
 * Add a user to a family. Idempotent: will not create duplicate membership.
 */
export async function addMemberToPlan(familyId: number, userId: number) {
	// check if exists
	const existing = await pglite
		.select()
		.from(memberTable)
		.where(and(eq(memberTable.family, familyId), eq(memberTable.user, userId)))
		.limit(1);

	if (existing.length > 0) return existing[0];

	const [inserted] = await pglite
		.insert(memberTable)
		.values({
			family: familyId,
			user: userId
		})
		.returning();
	return inserted;
}

/**
 * Remove a user from a family.
 */
export async function removeMemberFromPlan(familyId: number, userId: number) {
	await pglite
		.delete(memberTable)
		.where(and(eq(memberTable.family, familyId), eq(memberTable.user, userId)));
	return { ok: true };
}

/**
 * Get all users that belong to a family.
 * Returns user rows joined with member entries.
 */
export async function getUsersByPlan(familyId: number) {
	const rows = await pglite
		.select({
			userId: user.id,
			username: user.username
		})
		.from(user)
		.innerJoin(memberTable, eq(memberTable.user, user.id))
		.where(eq(memberTable.family, familyId));
	return rows;
}

/**
 * Get all families a user is part of.
 * Returns family rows joined with member entries.
 */
export async function getPlansByUser(userId: number) {
	const rows = await pglite
		.select({
			familyId: familyPlanTable.id,
			name: familyPlanTable.name,
			createdAt: familyPlanTable.createdAt,
			memberId: memberTable.id
		})
		.from(familyPlanTable)
		.innerJoin(memberTable, eq(memberTable.family, familyPlanTable.id))
		.where(eq(memberTable.user, userId));
	return rows;
}

/**
 * Bulk fetch users by ids (helper for UI).
 */
export async function getUsersByIds(userIds: string[]) {
	if (userIds.length === 0) return [];
	const rows = await pglite.select().from(user).where(inArray(user.id, userIds));
	return rows;
}
