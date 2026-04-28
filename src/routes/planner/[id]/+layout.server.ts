import { redirect } from '@sveltejs/kit';
import { getUsersByPlan } from '$lib/server/db/api/users';
import { getOrCreateInvitationToken } from '$lib/server/db/api/family';

export const load = async ({ locals, params }: { locals: App.Locals; params: Record<string, string> }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	const familyId = params.id;
	const members = await getUsersByPlan(familyId);
	const invitationToken = await getOrCreateInvitationToken(familyId);

	return {
		familyId,
		members,
		invitationToken
	};
};