import { getPlansByUser } from '#lib/server/db/api/users.js';
import type { Family } from '#lib/server/db/schema/family-plans.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }: { locals: App.Locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		throw redirect(303, '/auth/login');
	}

	const plans: Family[] = await getPlansByUser(userId);

	if (plans.length === 0) {
		throw redirect(307, '/planner/create');
	}

	if (plans.length === 1) {
		throw redirect(307, `/planner/${plans[0].id}/dashboard`);
	}

	return { plans };
};
