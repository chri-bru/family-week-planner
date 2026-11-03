import { command, form, getRequestEvent } from '$app/server';
import { createMeal, deleteMeal, updateMeal } from '#lib/server/db/api/meals.js';
import { getPlansByUser } from '#lib/server/db/api/users.js';
import type { MealType } from '#lib/server/db/schema/meals.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { deleteMealFormSchema, mealFormSchema } from './schema/meals';

const validateRequest = async (familyPlanId: string): Promise<string> => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'Unauthorized');
	}

	if (!familyPlanId) {
		error(400, 'Invalid family plan ID');
	}

	const plansByUser = await getPlansByUser(user.id);
	const userIsPartOfPlan = plansByUser.find((val) => val.id === familyPlanId);

	if (userIsPartOfPlan === undefined) {
		error(403, 'User is not part of the specified family plan');
	}

	return familyPlanId;
};

export const addMealAction = form(mealFormSchema, async (data) => {
	const familyPlanId = await validateRequest(data.familyPlanId);

	try {
		await createMeal({
			name: data.name,
			date: new Date(data.date),
			type: data.type as MealType,
			family: familyPlanId,
			link: data.link
		});
	} catch {
		error(501, 'There was an error creating the meal.');
	}

	redirect(302, `/planner/${familyPlanId}/meals`);
});

export const deleteMealAction = command(deleteMealFormSchema, async (data) => {
	await validateRequest(data.familyPlanId);
	const id = data.id;

	if (!id) {
		fail(400, { message: 'Missing meal ID' });
	}

	try {
		await deleteMeal(id);
		return { success: true };
	} catch {
		fail(500, { message: 'Failed to delete meal' });
	}
});

export const updateMealAction = command(mealFormSchema, async (data) => {
	const familyPlanId = await validateRequest(data.familyPlanId);
	const id = data.id;

	if (!id) {
		fail(400, { message: 'Missing meal ID' });
	}

	try {
		await updateMeal(id!, {
			name: data.name,
			date: new Date(data.date),
			type: data.type as MealType,
			family: familyPlanId,
			link: data.link
		});
		return { success: true };
	} catch {
		fail(500, { message: 'Failed to update meal' });
	}
});
