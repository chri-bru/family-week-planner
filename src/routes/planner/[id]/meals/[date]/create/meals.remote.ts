import { form } from '$app/server';
import { mealFormSchema } from '$lib/forms/schema/meal';
import { createMeal } from '$lib/server/db/api/meals';
import type { MealType } from '$lib/server/db/schema/meals';
import { error, redirect } from '@sveltejs/kit';

export const addMeal = form(mealFormSchema, async (data) => {
	try {
		console.log("Creating meal")
		await createMeal({
			name: data.name,
			date: new Date(data.date),
			type: data.type as MealType,
			family: data.familyPlanId,
			link: data.link
		});

		redirect(302, `/planner/${data.familyPlanId}/meals`);
	} catch (_err) {
		console.log(_err);
		error(503, 'There was an error creating the meal');
	}
});
