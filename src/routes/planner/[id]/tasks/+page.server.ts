import { redirect } from '@sveltejs/kit';
import { getChoresByFamily } from '#lib/server/db/api/chores.js';
import { getTasksByFamily } from '#lib/server/db/api/tasks.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	const [tasks, chores] = await Promise.all([
		getTasksByFamily(params.id, { completed: false }),
		getChoresByFamily(params.id)
	]);

	return {
		tasks,
		chores,
		currentUserId: locals.user.id
	};
};
