import { getPlansByUser } from '#lib/server/db/api/users.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }: { locals: App.Locals }) => {
	if (!locals.user) {
		return {};
	}

	const userId = locals.user?.id;

	let plans: Awaited<ReturnType<typeof getPlansByUser>> = [];

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
