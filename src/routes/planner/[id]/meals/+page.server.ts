import { getMealsForCurrentWeek } from '$lib/server/db/api/meals.js';
import type { Meal } from '$lib/server/db/schema/meals';

export const load = async ({ locals, params }: { params: Record<string, any>, locals: App.Locals }) => {
	const userId = locals.user?.id;
	const familyId = params.id;

	let meals: Meal[] = [];

	if (userId) {
		meals = await getMealsForCurrentWeek(familyId);
	}

	return { meals };
};
