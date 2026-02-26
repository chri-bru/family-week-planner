import {
	createMeal,
} from '$lib/server/db/api/meals.js';
import type { MealType } from '$lib/server/db/schema/meals';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { mealFormSchema } from '../../schema';
import type { Infer } from 'sveltekit-superforms';

export type MealFormData = Infer<typeof mealFormSchema>;

export const load = async ({ params }: { params: Record<string, any> }) => {
        const date = params.date as string
	return {
        date,
		form: await superValidate(zod4(mealFormSchema))
	};
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

		const form = await superValidate(request, zod4(mealFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const data = form.data as MealFormData;

		try {
			await createMeal({
				name: data.name,
				date: new Date(data.date),
				type: data.type as MealType,
				family: familyId,
				link: data.link
			});

			return redirect(303, `/planner/${familyId}/meals`);
		} catch (err) {
			console.error('Error saving meal:', err);
			return fail(500, { message: 'Failed to save meal' });
		}
	}
};
