import { z } from 'zod';

export const mealFormSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1, 'Name is required'),
	date: z.string().min(1, 'Date is required'),
	type: z.enum(['dinner', 'lunch', 'breakfast', 'snack', 'special']),
	link: z.string().optional()
});

export type MealFormSchema = typeof mealFormSchema;
