import { getMealsForCurrentWeek, deleteMeal } from '$lib/server/db/api/meals.js';
import type { Meal, MealType } from '$lib/server/db/schema/meals';
import { fail } from '@sveltejs/kit';

export const load = async ({
	locals,
	params
}: {
	params: Record<string, any>;
	locals: App.Locals;
}) => {
	const userId = locals.user?.id;
	const familyId = params.id;

	let meals: Meal[] = [];

	if (userId) {
		meals = await getMealsForCurrentWeek(familyId);
	}

	return {
		meals,
		familyId
	};
};

export const actions = {
	delete: async ({ request, locals }: { request: Request; locals: App.Locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, { message: 'Missing meal ID' });
		}

		try {
			await deleteMeal(parseInt(id as string));
			return { success: true };
		} catch (err) {
			console.error('Error deleting meal:', err);
			return fail(500, { message: 'Failed to delete meal' });
		}
	}
};
