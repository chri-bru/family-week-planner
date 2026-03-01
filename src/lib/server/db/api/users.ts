import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { user } from '../schema/users';
import { familyPlanTable, memberTable } from '../schema/family-plans';

/**
 * Queries existing users
 */
export async function findUser(id: string) {
	return await db.select().from(user).where(eq(user.id, id));
}

/**
 * Create a family plan and optionally add initial members.
 * This runs in a transaction to keep member table consistent.
 */
export async function createPlan(planName: string, memberIds?: string[]) {
	return await db.transaction(async (tx) => {
		const [familyRow] = await tx
			.insert(familyPlanTable)
			.values({
				name: planName
			})
			.returning();

		if (memberIds && memberIds.length > 0) {
			const memberRows = memberIds.map((userId) => ({
				family: familyRow.id,
				user: userId
			}));
			await tx.insert(memberTable).values(memberRows);
		}

		return familyRow;
	});
}

/**
 * Add a user to a family. Idempotent: will not create duplicate membership.
 */
export async function addMemberToPlan(familyId: string, userId: string) {
	// check if exists
	const existing = await db
		.select()
		.from(memberTable)
		.where(and(eq(memberTable.family, familyId), eq(memberTable.user, userId)))
		.limit(1);

	if (existing.length > 0) return existing[0];

	const [inserted] = await db
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
export async function removeMemberFromPlan(familyId: string, userId: string) {
	await db
		.delete(memberTable)
		.where(and(eq(memberTable.family, familyId), eq(memberTable.user, userId)));
	return { ok: true };
}

/**
 * Get all users that belong to a family.
 * Returns user rows joined with member entries.
 */
export async function getUsersByPlan(familyId: string) {
	const rows = await db
		.select({
			userId: user.id,
			username: user.name
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
export async function getPlansByUser(userId: string) {
	const rows = await db
		.select({
			id: familyPlanTable.id,
			name: familyPlanTable.name,
			createdAt: familyPlanTable.createdAt,
			updatedAt: familyPlanTable.updatedAt
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
	const rows = await db.select().from(user).where(inArray(user.id, userIds));
	return rows;
}
