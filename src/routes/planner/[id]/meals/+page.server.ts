import {
	getMealsForCurrentWeek,
	createMeal,
	updateMeal,
	deleteMeal
} from '$lib/server/db/api/meals.js';
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

	return { meals };
};

export const actions = {
	save: async ({
		request,
		locals,
		params
	}: {
		request: Request;
		locals: App.Locals;
		params: Record<string, any>;
	}) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { message: 'Unauthorized' });
		}

		const familyId = parseInt(params.id);

		if (!familyId || isNaN(familyId)) {
			return fail(400, { message: 'Invalid family ID' });
		}

		const formData = await request.formData();
		const id = formData.get('id');
		const name = formData.get('name') as string;
		const date = formData.get('date') as string;
		const type = formData.get('type') as string;
		const link = formData.get('link') as string | null;

		if (!name || !date || !type) {
			return fail(400, { message: 'Missing required fields' });
		}

		try {
			if (id) {
				await updateMeal(parseInt(id as string), {
					name,
					date: new Date(date),
					type: type as MealType,
					link: link ?? undefined
				});
			} else {
				await createMeal({
					name,
					date: new Date(date),
					type: type as MealType,
					family: familyId,
					link: link ?? undefined
				});
			}
			return { success: true };
		} catch (err) {
			console.error('Error saving meal:', err);
			return fail(500, { message: 'Failed to save meal' });
		}
	},

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
