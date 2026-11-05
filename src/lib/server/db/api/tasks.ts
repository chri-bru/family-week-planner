import { and, asc, eq, gte, isNotNull, isNull, lte } from 'drizzle-orm';
import { db } from '../db';
import { chore, task, type Task } from '../schema/tasks';
import { nextOccurrence, normalizeDateOnly } from './recurrence';

export type CreateTaskInput = {
	familyId: string;
	title: string;
	description?: string | null;
	dueDate?: string | null;
	assignedTo?: string | null;
	createdBy?: string | null;
};

export type UpdateTaskInput = {
	title?: string;
	description?: string | null;
	dueDate?: string | null;
	assignedTo?: string | null;
};

export type TaskFilters = {
	completed?: boolean;
	from?: string;
	to?: string;
	choreId?: number;
};

export type CompleteTaskResult = {
	completed: Task;
	next: Task | null;
};

export async function createTask(input: CreateTaskInput): Promise<Task> {
	if (!input.title.trim()) {
		throw new Error('Task title is required');
	}

	const [created] = await db
		.insert(task)
		.values({
			family: input.familyId,
			title: input.title,
			description: input.description ?? null,
			dueDate: input.dueDate ? normalizeDateOnly(input.dueDate) : null,
			assignedTo: input.assignedTo ?? null,
			createdBy: input.createdBy ?? null
		})
		.returning();

	return created;
}

export async function getTaskById(id: number): Promise<Task | null> {
	const [result] = await db.select().from(task).where(eq(task.id, id)).limit(1);
	return result ?? null;
}

export async function getTasksByFamily(
	familyId: string,
	filters: TaskFilters = {}
): Promise<Task[]> {
	const conditions = [eq(task.family, familyId)];

	if (filters.completed === true) {
		conditions.push(isNotNull(task.completedAt));
	} else if (filters.completed === false) {
		conditions.push(isNull(task.completedAt));
	}

	if (filters.from) {
		conditions.push(gte(task.dueDate, normalizeDateOnly(filters.from)));
	}

	if (filters.to) {
		conditions.push(lte(task.dueDate, normalizeDateOnly(filters.to)));
	}

	if (filters.choreId !== undefined) {
		conditions.push(eq(task.chore, filters.choreId));
	}

	return await db
		.select()
		.from(task)
		.where(and(...conditions))
		.orderBy(asc(task.dueDate));
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task | null> {
	const [existing] = await db.select().from(task).where(eq(task.id, id)).limit(1);

	if (!existing) {
		return null;
	}

	if (existing.chore !== null) {
		throw new Error('Chore tasks must be updated through their chore');
	}

	const updates: Partial<typeof task.$inferInsert> = {
		updatedAt: new Date()
	};

	if (input.title !== undefined) {
		if (!input.title.trim()) {
			throw new Error('Task title is required');
		}
		updates.title = input.title;
	}

	if (input.description !== undefined) {
		updates.description = input.description;
	}

	if (input.dueDate !== undefined) {
		updates.dueDate = input.dueDate ? normalizeDateOnly(input.dueDate) : null;
	}

	if (input.assignedTo !== undefined) {
		updates.assignedTo = input.assignedTo;
	}

	const [updated] = await db.update(task).set(updates).where(eq(task.id, id)).returning();
	return updated ?? null;
}

export async function deleteTask(id: number): Promise<{ ok: boolean }> {
	const [existing] = await db.select().from(task).where(eq(task.id, id)).limit(1);

	if (!existing) {
		return { ok: true };
	}

	if (existing.chore !== null) {
		throw new Error('Chore tasks must be deleted through their chore');
	}

	await db.delete(task).where(eq(task.id, id));
	return { ok: true };
}

export async function getTasksByChore(choreId: number): Promise<Task[]> {
	return await db
		.select()
		.from(task)
		.where(eq(task.chore, choreId))
		.orderBy(asc(task.dueDate), asc(task.id));
}

export async function getPendingTaskByChore(choreId: number): Promise<Task | null> {
	const [result] = await db
		.select()
		.from(task)
		.where(and(eq(task.chore, choreId), isNull(task.completedAt)))
		.limit(1);

	return result ?? null;
}

export async function completeTask(
	id: number,
	completedBy?: string | null
): Promise<CompleteTaskResult> {
	return await db.transaction(async (tx) => {
		const [completed] = await tx
			.update(task)
			.set({
				completedAt: new Date(),
				completedBy: completedBy ?? null,
				updatedAt: new Date()
			})
			.where(and(eq(task.id, id), isNull(task.completedAt)))
			.returning();

		if (!completed) {
			throw new Error('Task not found or already completed');
		}

		if (completed.chore === null) {
			return { completed, next: null };
		}

		const [choreRow] = await tx.select().from(chore).where(eq(chore.id, completed.chore)).limit(1);

		if (!choreRow) {
			throw new Error('Chore not found');
		}

		const nextDueDate = nextOccurrence(
			choreRow.startDate,
			completed.dueDate ?? choreRow.nextDueDate,
			choreRow.frequency
		);

		await tx
			.update(chore)
			.set({
				nextDueDate,
				updatedAt: new Date()
			})
			.where(eq(chore.id, choreRow.id));

		const [next] = await tx
			.insert(task)
			.values({
				family: completed.family,
				chore: choreRow.id,
				title: choreRow.title,
				description: choreRow.description,
				dueDate: nextDueDate,
				assignedTo: choreRow.assignedTo,
				createdBy: choreRow.createdBy
			})
			.returning();

		return { completed, next };
	});
}
