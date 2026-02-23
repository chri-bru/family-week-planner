import { getPlansByUser } from '$lib/server/db/api/users';

export const load = async ({ locals }: { locals: App.Locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		return { plans: [] };
	}

	const plans = await getPlansByUser(userId);
	return { plans };
};
