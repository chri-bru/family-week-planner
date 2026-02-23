import { getPlansByUser } from '$lib/server/db/api/users';
import type { Family } from '$lib/server/db/schema/family-plans';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './[id]/meals/$types';

export const load: PageServerLoad = async ({ locals }: { locals: App.Locals }) => {
	const userId = locals.user?.id;

	let plans: Family[] = [];

	if (userId) {
		plans = await getPlansByUser(userId);
	}

	if (plans.length === 0) {
		redirect(307, '/planner/create');
	}

	return { plans };
};
