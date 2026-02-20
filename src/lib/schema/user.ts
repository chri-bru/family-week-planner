import { z } from 'zod';
export const userFormSchema = z.object({
	username: z
		.string({ error: 'Please enter your username.' })
		.min(1, { error: 'This field is required.' })
});
