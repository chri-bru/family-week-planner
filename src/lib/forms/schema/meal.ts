import { z } from 'zod';

export const mealFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	date: z.string().min(1, 'Date is required'),
	type: z.enum(['breakfast', 'dinner', 'lunch', 'special', 'snack']),
	link: z.string().optional()
});
