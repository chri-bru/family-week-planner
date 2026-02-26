import { z } from 'zod';
export const familyPlanFormSchema = z.object({
	name: z
		.string({ error: "Please enter your plan's name." })
		.min(1, { error: 'This field is required.' })
});
