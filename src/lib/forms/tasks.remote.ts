import { command, form, getRequestEvent } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { createChore, deleteChore, getChoreById, updateChore } from '#lib/server/db/api/chores.js';
import {
	completeTask,
	createTask,
	deleteTask,
	getTaskById,
	updateTask
} from '#lib/server/db/api/tasks.js';
import { todayDateString } from '#lib/server/db/api/recurrence.js';
import { getPlansByUser } from '#lib/server/db/api/users.js';
import { isUserMember } from '#lib/server/db/api/family.js';
import {
	completeTaskFormSchema,
	createTaskFormSchema,
	deleteTaskFormSchema,
	updateTaskFormSchema
} from './schema/tasks.js';

const optionalText = (value?: string | null) => value?.trim() || null;

const requireUserForFamily = async (familyPlanId: string) => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'Unauthorized');
	}

	if (!familyPlanId) {
		error(400, 'Invalid family plan ID');
	}

	const plansByUser = await getPlansByUser(user.id);
	const userIsPartOfPlan = plansByUser.some((plan) => plan.id === familyPlanId);

	if (!userIsPartOfPlan) {
		error(403, 'User is not part of the specified family plan');
	}

	return user;
};

const requireFamilyMember = async (familyPlanId: string, userId: string | null) => {
	if (!userId) {
		return null;
	}

	if (!(await isUserMember(familyPlanId, userId))) {
		error(400, 'Assignee must be a family member');
	}

	return userId;
};

export const createTaskAction = form(createTaskFormSchema, async (data) => {
	const user = await requireUserForFamily(data.familyPlanId);
	const description = optionalText(data.description);
	const assignedTo = await requireFamilyMember(data.familyPlanId, optionalText(data.assignedTo));

	if (data.isChore) {
		const frequency = data.frequency;
		const startDate = data.dueDate;

		if (!frequency) {
			error(400, 'Frequency is required for chores');
		}

		if (!startDate) {
			error(400, 'Due date is required for chores');
		}

		try {
			await createChore({
				familyId: data.familyPlanId,
				title: data.title,
				description,
				frequency,
				startDate,
				assignedTo,
				createdBy: user.id
			});
		} catch {
			error(500, 'There was an error creating the chore.');
		}
	} else {
		try {
			await createTask({
				familyId: data.familyPlanId,
				title: data.title,
				description,
				dueDate: data.dueDate || null,
				assignedTo,
				createdBy: user.id
			});
		} catch {
			error(500, 'There was an error creating the task.');
		}
	}

	redirect(303, `/planner/${data.familyPlanId}/tasks`);
});

export const updateTaskAction = command(updateTaskFormSchema, async (data) => {
	await requireUserForFamily(data.familyPlanId);

	const description = optionalText(data.description);
	const assignedTo = await requireFamilyMember(data.familyPlanId, optionalText(data.assignedTo));

	if (data.choreId) {
		const choreRow = await getChoreById(data.choreId);

		if (!choreRow || choreRow.family !== data.familyPlanId) {
			error(404, 'Chore not found');
		}

		const taskRow = await getTaskById(data.taskId);

		if (!taskRow || taskRow.family !== data.familyPlanId || taskRow.chore !== data.choreId) {
			error(404, 'Task not found');
		}

		const dueDate = data.dueDate || null;

		if (!dueDate) {
			error(400, 'Due date is required for chores');
		}

		const startDate = dueDate !== taskRow.dueDate ? dueDate : undefined;

		if (startDate && startDate < todayDateString()) {
			error(400, 'Due date must be today or later');
		}

		try {
			await updateChore(data.choreId, {
				title: data.title,
				description,
				assignedTo,
				frequency: data.frequency !== choreRow.frequency ? data.frequency : undefined,
				...(startDate ? { startDate } : {})
			});
		} catch {
			error(500, 'Failed to update chore');
		}

		return { success: true };
	}

	const taskRow = await getTaskById(data.taskId);

	if (!taskRow || taskRow.family !== data.familyPlanId || taskRow.chore !== null) {
		error(404, 'Task not found');
	}

	try {
		await updateTask(data.taskId, {
			title: data.title,
			description,
			dueDate: data.dueDate || null,
			assignedTo
		});
	} catch {
		error(500, 'Failed to update task');
	}

	return { success: true };
});

export const deleteTaskAction = command(deleteTaskFormSchema, async (data) => {
	await requireUserForFamily(data.familyPlanId);

	if (data.choreId) {
		const choreRow = await getChoreById(data.choreId);

		if (!choreRow || choreRow.family !== data.familyPlanId) {
			error(404, 'Chore not found');
		}

		try {
			await deleteChore(data.choreId);
		} catch {
			error(500, 'Failed to delete chore');
		}

		return { success: true };
	}

	const taskRow = await getTaskById(data.taskId);

	if (!taskRow || taskRow.family !== data.familyPlanId || taskRow.chore !== null) {
		error(404, 'Task not found');
	}

	try {
		await deleteTask(data.taskId);
	} catch {
		error(500, 'Failed to delete task');
	}

	return { success: true };
});

export const completeTaskAction = command(completeTaskFormSchema, async (data) => {
	const user = await requireUserForFamily(data.familyPlanId);
	const taskRow = await getTaskById(data.taskId);

	if (!taskRow || taskRow.family !== data.familyPlanId) {
		error(404, 'Task not found');
	}

	if (taskRow.completedAt) {
		error(409, 'Task is already completed');
	}

	try {
		await completeTask(data.taskId, user.id);
	} catch {
		error(500, 'Failed to complete task');
	}

	return { success: true };
});
