import { form, getRequestEvent } from '$app/server';
import { familyPlanFormSchema } from '$lib/forms/schema/family-plan';
import { createPlan as createFamilyPlan } from '$lib/server/db/api/users';
import { error, redirect } from '@sveltejs/kit';

export const createPlanForUser = form(familyPlanFormSchema, async (data) => {
	try {
		const event = getRequestEvent();
		const user = event.locals.user;

		if (!user) {
			error(401, 'Unauthorized');
		}
		const plan = await createFamilyPlan(data.name, [user.id]);

		redirect(303, `/planner/${plan.id}/dashboard`);
	} catch (_err) {
		console.log(_err);
		error(503, 'There was an error creating the plan');
	}
});
