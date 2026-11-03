# Tasks & Chores Implementation Plan

## Scope

- Implement the database layer and CRUD API for one-off tasks and recurring chores.
- Do not implement UI or create the `/planner/[id]/tasks` route yet.
- Leave the Tasks entry in the bottom navigation disabled.

## 1. Database Schema

Replace the commented draft in `src/lib/server/db/schema/tasks.ts` with real tables.

### Enums

```ts
const choreFrequencies = ['weekly', 'monthly', 'quarterly', 'half_yearly', 'yearly'] as const;
export const choreFrequency = pgEnum('chore_frequency', choreFrequencies);
```

### `chore` table

- `id` — integer identity primary key
- `family` — text, not null, references `family_plan.id`
- `title` — varchar(256), not null
- `description` — text, nullable
- `frequency` — `chore_frequency`, not null
- `startDate` — date, not null; anchor date and first occurrence
- `nextDueDate` — date, not null; current completion target
- `assignedTo` — text, nullable, references `user.id`
- `createdBy` — text, nullable, references `user.id`
- `createdAt` — timestamp, default now
- `updatedAt` — timestamp, default now

Indexes:

- `chore_family_idx` on `family`

### `task` table

- `id` — integer identity primary key
- `family` — text, not null, references `family_plan.id`
- `chore` — integer, nullable, references `chore.id` with cascade delete
- `title` — varchar(256), not null; snapshotted from the chore when created
- `description` — text, nullable
- `dueDate` — date, nullable; required for chore tasks
- `assignedTo` — text, nullable, references `user.id`
- `completedAt` — timestamp, nullable
- `completedBy` — text, nullable, references `user.id`
- `createdBy` — text, nullable, references `user.id`
- `createdAt` — timestamp, default now
- `updatedAt` — timestamp, default now

Indexes and constraints:

- `task_family_due_idx` on `(family, dueDate)`
- `task_chore_idx` on `chore`
- `task_pending_chore_unique` — partial unique index on `chore` where `completed_at IS NULL`, enforcing at most one pending task per chore

Completed task rows are retained as history.

### Types

Export:

- `Chore`
- `Task`
- `ChoreFrequency`
- inferred insert types if useful

## 2. Recurrence Helper

Add a pure date helper, e.g. `src/lib/server/db/api/recurrence.ts`.

Rules:

- Use date-only logic in UTC to avoid timezone drift.
- `weekly`: add 7 days.
- `monthly`: add 1 month.
- `quarterly`: add 3 months.
- `half_yearly`: add 6 months.
- `yearly`: add 12 months.
- For month/year increments, preserve the anchor day-of-month and clamp to the last valid day of the target month.
  - Example: Jan 31 → Feb 28 → Mar 31.
- Validate that a new chore `startDate` is today or in the future.

Function shape:

```ts
nextOccurrence(startDate: string, currentDueDate: string, frequency: ChoreFrequency): string
```

## 3. CRUD API

Add `src/lib/server/db/api/tasks.ts` and `src/lib/server/db/api/chores.ts`.

The database API remains authorization-agnostic. Authentication and family membership checks stay in remote functions or route handlers later.

### Chores API

- `createChore(input)` — transaction:
  - insert chore
  - insert first pending task with `dueDate = startDate`
- `getChoreById(id)`
- `getChoresByFamily(familyId)` — include the pending/next task
- `updateChore(id, input)` — update chore metadata and sync the pending task title/description/assignee
- `deleteChore(id)` — deletes the chore and its tasks
- `completeChore(id, completedBy)` — convenience wrapper that completes the pending task

### Tasks API

- `createTask(input)` — one-off tasks only (`chore` is null)
- `getTaskById(id)`
- `getTasksByFamily(familyId, filters)` — filter pending/completed, date range, and chore
- `updateTask(id, input)` — one-off task fields
- `deleteTask(id)` — one-off tasks
- `getTasksByChore(choreId)` — chore history

### Completing a task

`completeTask(id, completedBy)` runs in a transaction:

1. Atomically mark the pending task as completed.
2. If the task belongs to a chore, load the chore and compute the next due date.
3. Update `chore.nextDueDate`.
4. Insert the next pending task with the chore's current title, description, and assignee.
5. Return `{ completed, next }`.

For one-off tasks, `next` is `null`.

## 4. Update and Reschedule Behavior

- Updating chore title, description, or assignee also updates the pending task snapshot.
- If `frequency` or `startDate` changes:
  - recompute `nextDueDate`
  - update the pending task's `dueDate`
- Reject `startDate` values in the past.

## 5. Migration and Verification

- Run `bun run db:generate` to generate the Drizzle migration.
- Run `bun run check`.
- Run targeted ESLint and Prettier checks.
- Run `bun run build`.
- Do not modify routes, UI components, or bottom navigation for this task.

## Open Decisions

1. **Late completion:** advance one interval from the scheduled date
2. **History:**reuse a single task row per chore
3. **API scope:** database-layer functions only
4. **Chore deletion:** hard-delete the chore and its tasks