import { form, query } from '$app/server';
import { planFormSchema } from '$lib/schema/plan';
import { createPlan, getPlansByUser } from '$lib/server/db/api/users';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

export const getPlansForUser = query(z.number(), async (userId) => {
	return await getPlansByUser(userId);
});

export const createPlanForUser = form(planFormSchema, async (data) => {
	try {
		const plan = await createPlan(data.planName, [data.userId]);
		return {
			success: true,
			plan
		};
	} catch (_err) {
		console.log(_err);
		error(503, 'There was an error creating the plan');
	}
});
