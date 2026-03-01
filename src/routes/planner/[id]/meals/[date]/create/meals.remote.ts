import { form, getRequestEvent } from '$app/server';
import { mealFormSchema } from '$lib/forms/schema/meal';
import { createMeal } from '$lib/server/db/api/meals';
import { getPlansByUser } from '$lib/server/db/api/users';
import type { MealType } from '$lib/server/db/schema/meals';
import { error, redirect } from '@sveltejs/kit';

export const addMeal = form(mealFormSchema, async (data) => {
	const event = getRequestEvent();
	const user = event.locals.user;
	const familyPlanId = event.params.id;

	if (!user) {
		error(401, 'Unauthorized');
	}

	if (!familyPlanId) {
		error(400, 'Invalid family plan ID');
	}

	const plansByUser = await getPlansByUser(user.id)

	if (plansByUser === undefined || plansByUser.length === 0) {
		const userIsPartOfPlan = plansByUser.find( (val) => val.id === familyPlanId)

		if (userIsPartOfPlan === undefined) {
			error(403, 'User is not part of the specified family plan');
		}
	}

	try {

		await createMeal({
			name: data.name,
			date: new Date(data.date),
			type: data.type as MealType,
			family: familyPlanId,
			link: data.link
		});
	} catch(_err) {
		error(501, "There was an error creating the meal.")
	}

	redirect(302, `/planner/${familyPlanId}/meals`);
});
