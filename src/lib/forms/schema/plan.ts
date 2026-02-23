import { z } from 'zod';
export const planFormSchema = z.object({
	name: z
		.string({ error: "Please enter your plan's name." })
		.min(1, { error: 'This field is required.' })
});
