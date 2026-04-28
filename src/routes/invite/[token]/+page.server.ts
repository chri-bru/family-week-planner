import { redirect, error } from '@sveltejs/kit';
import { getFamilyByToken, acceptInvitationToken, isUserMember } from '$lib/server/db/api/family';

export const load = async ({ locals, params, url }: { locals: App.Locals; params: Record<string, string>; url: URL }) => {
	const token = params.token;
	const family = await getFamilyByToken(token);

	if (!family) {
		throw error(404, 'Invalid invitation link');
	}

	const user = locals.user;
	let isMember = false;

	if (user) {
		isMember = await isUserMember(family.id, user.id);
	}

	return {
		token,
		family,
		isMember,
		user,
		redirectTo: url.pathname
	};
};