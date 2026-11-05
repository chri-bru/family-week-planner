import { and, asc, eq, isNull } from 'drizzle-orm';
import { db } from '../db';
import { chore, task, type Chore, type ChoreFrequency, type Task } from '../schema/tasks';
import { assertTodayOrFuture, nextOccurrence } from './recurrence';
import { completeTask, getPendingTaskByChore, type CompleteTaskResult } from './tasks';

export type CreateChoreInput = {
	familyId: string;
	title: string;
	description?: string | null;
	frequency: ChoreFrequency;
	startDate: string;
	assignedTo?: string | null;
	createdBy?: string | null;
};

export type UpdateChoreInput = {
	title?: string;
	description?: string | null;
	frequency?: ChoreFrequency;
	startDate?: string;
	assignedTo?: string | null;
};

export type ChoreWithNextTask = Chore & {
	nextTask: Task | null;
};

export type CreateChoreResult = {
	chore: Chore;
	nextTask: Task;
};

export async function createChore(input: CreateChoreInput): Promise<CreateChoreResult> {
	if (!input.title.trim()) {
		throw new Error('Chore title is required');
	}

	const startDate = assertTodayOrFuture(input.startDate);

	return await db.transaction(async (tx) => {
		const [createdChore] = await tx
			.insert(chore)
			.values({
				family: input.familyId,
				title: input.title,
				description: input.description ?? null,
				frequency: input.frequency,
				startDate,
				nextDueDate: startDate,
				assignedTo: input.assignedTo ?? null,
				createdBy: input.createdBy ?? null
			})
			.returning();

		const [nextTask] = await tx
			.insert(task)
			.values({
				family: input.familyId,
				chore: createdChore.id,
				title: input.title,
				description: input.description ?? null,
				dueDate: startDate,
				assignedTo: input.assignedTo ?? null,
				createdBy: input.createdBy ?? null
			})
			.returning();

		return { chore: createdChore, nextTask };
	});
}

export async function getChoreById(id: number): Promise<Chore | null> {
	const [result] = await db.select().from(chore).where(eq(chore.id, id)).limit(1);
	return result ?? null;
}

export async function getChoresByFamily(familyId: string): Promise<ChoreWithNextTask[]> {
	const rows = await db
		.select({
			chore,
			nextTask: task
		})
		.from(chore)
		.leftJoin(task, and(eq(task.chore, chore.id), isNull(task.completedAt)))
		.where(eq(chore.family, familyId))
		.orderBy(asc(chore.nextDueDate));

	return rows.map((row) => ({
		...row.chore,
		nextTask: row.nextTask ?? null
	}));
}

export async function updateChore(id: number, input: UpdateChoreInput): Promise<Chore | null> {
	return await db.transaction(async (tx) => {
		const [existing] = await tx.select().from(chore).where(eq(chore.id, id)).limit(1);

		if (!existing) {
			return null;
		}

		const updates: Partial<typeof chore.$inferInsert> = {
			updatedAt: new Date()
		};
		const taskUpdates: Partial<typeof task.$inferInsert> = {
			updatedAt: new Date()
		};

		if (input.title !== undefined) {
			if (!input.title.trim()) {
				throw new Error('Chore title is required');
			}
			updates.title = input.title;
			taskUpdates.title = input.title;
		}

		if (input.description !== undefined) {
			updates.description = input.description;
			taskUpdates.description = input.description;
		}

		if (input.assignedTo !== undefined) {
			updates.assignedTo = input.assignedTo;
			taskUpdates.assignedTo = input.assignedTo;
		}

		let nextDueDate = existing.nextDueDate;
		let shouldReschedule = false;

		if (input.startDate !== undefined) {
			nextDueDate = assertTodayOrFuture(input.startDate);
			updates.startDate = nextDueDate;
			shouldReschedule = true;
		}

		if (input.frequency !== undefined) {
			updates.frequency = input.frequency;

			if (input.startDate === undefined) {
				nextDueDate = nextOccurrence(existing.startDate, existing.nextDueDate, input.frequency);
				shouldReschedule = true;
			}
		}

		if (shouldReschedule) {
			updates.nextDueDate = nextDueDate;
			taskUpdates.dueDate = nextDueDate;
		}

		const [updatedChore] = await tx.update(chore).set(updates).where(eq(chore.id, id)).returning();

		await tx
			.update(task)
			.set(taskUpdates)
			.where(and(eq(task.chore, id), isNull(task.completedAt)));

		return updatedChore ?? null;
	});
}

export async function deleteChore(id: number): Promise<{ ok: boolean }> {
	await db.delete(chore).where(eq(chore.id, id));
	return { ok: true };
}

export async function completeChore(
	id: number,
	completedBy?: string | null
): Promise<CompleteTaskResult> {
	const pendingTask = await getPendingTaskByChore(id);

	if (!pendingTask) {
		throw new Error('Chore has no pending task');
	}

	return await completeTask(pendingTask.id, completedBy);
}
