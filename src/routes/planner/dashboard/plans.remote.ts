import { form, getRequestEvent, query } from '$app/server';
import { planFormSchema } from '$lib/forms/schema/plan';
import { createPlan } from '$lib/server/db/api/users';
import { error } from '@sveltejs/kit';

export const createPlanForUser = form(planFormSchema, async (data) => {
	try {
		const event = getRequestEvent();
		const user = event.locals.user;

		if (!user) {
			error(401, 'Unauthorized');
		}
		const plan = await createPlan(data.planName, [user.id]);
		return {
			success: true,
			plan
		};
	} catch (_err) {
		console.log(_err);
		error(503, 'There was an error creating the plan');
	}
});
