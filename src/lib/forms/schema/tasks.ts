import { z } from 'zod';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export const choreFrequencySchema = z.enum([
	'weekly',
	'monthly',
	'quarterly',
	'half_yearly',
	'yearly'
]);

const todayDateString = () => new Date().toISOString().slice(0, 10);

export const createTaskFormSchema = z
	.object({
		familyPlanId: z.string().min(1, 'Family plan ID is required'),
		title: z.string().trim().min(1, 'Title is required').max(256, 'Title is too long'),
		description: z.string().optional().default(''),
		dueDate: z.string().optional().default(''),
		assignedTo: z.string().optional().default(''),
		isChore: z.boolean().default(false),
		frequency: choreFrequencySchema.optional()
	})
	.superRefine((data, ctx) => {
		if (data.dueDate && !DATE_ONLY.test(data.dueDate)) {
			ctx.addIssue({
				code: 'custom',
				path: ['dueDate'],
				message: 'Enter a valid due date'
			});
			return;
		}

		if (!data.isChore) {
			return;
		}

		if (!data.dueDate) {
			ctx.addIssue({
				code: 'custom',
				path: ['dueDate'],
				message: 'Due date is required for chores'
			});
		} else if (data.dueDate < todayDateString()) {
			ctx.addIssue({
				code: 'custom',
				path: ['dueDate'],
				message: 'Chore due date must be today or later'
			});
		}

		if (!data.frequency) {
			ctx.addIssue({
				code: 'custom',
				path: ['frequency'],
				message: 'Frequency is required for chores'
			});
		}
	});

export const updateTaskFormSchema = z
	.object({
		familyPlanId: z.string().min(1, 'Family plan ID is required'),
		taskId: z.number().int().positive(),
		choreId: z.number().int().positive().nullable().optional(),
		title: z.string().trim().min(1, 'Title is required').max(256, 'Title is too long'),
		description: z.string().optional().default(''),
		dueDate: z.string().optional().default(''),
		assignedTo: z.string().optional().default(''),
		frequency: choreFrequencySchema.optional(),
		isChore: z.boolean().optional().default(false)
	})
	.superRefine((data, ctx) => {
		if (data.dueDate && !DATE_ONLY.test(data.dueDate)) {
			ctx.addIssue({
				code: 'custom',
				path: ['dueDate'],
				message: 'Enter a valid due date'
			});
			return;
		}

		if ((data.isChore || data.choreId) && !data.dueDate) {
			ctx.addIssue({
				code: 'custom',
				path: ['dueDate'],
				message: 'Due date is required for chores'
			});
		}
	});

export const deleteTaskFormSchema = z.object({
	familyPlanId: z.string().min(1, 'Family plan ID is required'),
	taskId: z.number().int().positive(),
	choreId: z.number().int().positive().nullable().optional()
});

export const completeTaskFormSchema = z.object({
	familyPlanId: z.string().min(1, 'Family plan ID is required'),
	taskId: z.number().int().positive()
});
