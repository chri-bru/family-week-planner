import { getPlansByUser } from '$lib/server/db/api/users';
import type { Family } from '$lib/server/db/schema/family-plans';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }: { locals: App.Locals }) => {
	if (!locals.user) {
		return {};
	}

	const userId = locals.user?.id;

	let plans: Family[] = [];

	if (userId) {
		plans = await getPlansByUser(userId);
	}

	if (plans.length === 0) {
		throw redirect(307, '/planner/create');
	}

	if (plans.length === 1) {
		throw redirect(307, `/planner/${plans[0].id}/dashboard`);
	}

	throw redirect(307, '/planner');
};
