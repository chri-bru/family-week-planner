import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { familyPlanTable, memberTable } from '../schema/family-plans';
import { user } from '../schema/users';

function generateToken(): string {
	return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

export async function getOrCreateInvitationToken(familyId: string): Promise<string> {
	const [family] = await db
		.select({ invitationToken: familyPlanTable.invitationToken })
		.from(familyPlanTable)
		.where(eq(familyPlanTable.id, familyId))
		.limit(1);

	if (!family) {
		throw new Error('Family not found');
	}

	if (family.invitationToken) {
		return family.invitationToken;
	}

	const token = generateToken();
	await db
		.update(familyPlanTable)
		.set({ invitationToken: token })
		.where(eq(familyPlanTable.id, familyId));

	return token;
}

export async function getFamilyByToken(token: string) {
	const [family] = await db
		.select({
			id: familyPlanTable.id,
			name: familyPlanTable.name,
			invitationToken: familyPlanTable.invitationToken,
			createdAt: familyPlanTable.createdAt
		})
		.from(familyPlanTable)
		.where(eq(familyPlanTable.invitationToken, token))
		.limit(1);

	return family || null;
}

export async function acceptInvitationToken(token: string, userId: string) {
	const family = await getFamilyByToken(token);

	if (!family) {
		throw new Error('Invalid invitation token');
	}

	const existingMember = await db
		.select()
		.from(memberTable)
		.where(and(eq(memberTable.family, family.id), eq(memberTable.user, userId)))
		.limit(1);

	if (existingMember.length > 0) {
		return { alreadyMember: true, family };
	}

	await db.insert(memberTable).values({
		family: family.id,
		user: userId
	});

	return { alreadyMember: false, family };
}

export async function isUserMember(familyId: string, userId: string): Promise<boolean> {
	const [member] = await db
		.select()
		.from(memberTable)
		.where(and(eq(memberTable.family, familyId), eq(memberTable.user, userId)))
		.limit(1);

	return member !== undefined;
}

export async function getFamilyMembers(familyId: string) {
	const members = await db
		.select({
			userId: user.id,
			username: user.name,
			email: user.email
		})
		.from(user)
		.innerJoin(memberTable, eq(memberTable.user, user.id))
		.where(eq(memberTable.family, familyId));

	return members;
}