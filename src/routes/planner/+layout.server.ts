import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }: { locals: App.Locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	// TODO add redirect when the user is not part of the requested family plan

	return {};
};
