# Tasks and Chores

This document describes the database schema, server-side API, UI components, and user flows for one-off tasks and recurring chores.

The Tasks entry in the bottom navigation is enabled and links to the family's task overview.

## Concepts

- **One-off task**: a `task` row with `chore_id = NULL`.
- **Chore**: a recurring definition stored in the `chore` table.
- **Chore task**: a `task` row linked to a chore. Each chore has exactly one pending task at a time.
- **History**: completed chore tasks remain in the database. Completing a chore adds a new pending task instead of overwriting the completed row.

## Data Model

Implementation: `src/lib/server/db/schema/tasks.ts`.

### `chore_frequency` enum

| Value         | Meaning         |
| ------------- | --------------- |
| `weekly`      | Every 7 days    |
| `monthly`     | Every month     |
| `quarterly`   | Every 3 months  |
| `half_yearly` | Every 6 months  |
| `yearly`      | Every 12 months |

### `chore` table

| Column          | Type              | Nullable | Default  | Notes                                |
| --------------- | ----------------- | -------- | -------- | ------------------------------------ |
| `id`            | `integer`         | no       | identity | Primary key                          |
| `family`        | `text`            | no       |          | References `family_plan.id`          |
| `title`         | `varchar(256)`    | no       |          |                                      |
| `description`   | `text`            | yes      |          |                                      |
| `frequency`     | `chore_frequency` | no       |          | Recurrence pattern                   |
| `start_date`    | `date`            | no       |          | Schedule anchor and first occurrence |
| `next_due_date` | `date`            | no       |          | Current completion target            |
| `assigned_to`   | `text`            | yes      |          | References `user.id`                 |
| `created_by`    | `text`            | yes      |          | References `user.id`                 |
| `created_at`    | `timestamp`       | no       | `now()`  |                                      |
| `updated_at`    | `timestamp`       | no       | `now()`  |                                      |

Index: `chore_family_idx` on `family`.

### `task` table

| Column         | Type           | Nullable | Default  | Notes                                     |
| -------------- | -------------- | -------- | -------- | ----------------------------------------- |
| `id`           | `integer`      | no       | identity | Primary key                               |
| `family`       | `text`         | no       |          | References `family_plan.id`               |
| `chore_id`     | `integer`      | yes      |          | References `chore.id`; `NULL` for one-off |
| `title`        | `varchar(256)` | no       |          | Snapshot of the chore title               |
| `description`  | `text`         | yes      |          | Snapshot of the chore description         |
| `due_date`     | `date`         | yes      |          | Required for chore tasks                  |
| `assigned_to`  | `text`         | yes      |          | References `user.id`                      |
| `completed_at` | `timestamp`    | yes      |          | `NULL` while pending                      |
| `completed_by` | `text`         | yes      |          | References `user.id`                      |
| `created_by`   | `text`         | yes      |          | References `user.id`                      |
| `created_at`   | `timestamp`    | no       | `now()`  |                                           |
| `updated_at`   | `timestamp`    | no       | `now()`  |                                           |

Indexes and constraints:

- `task_family_due_idx` on `(family, due_date)`
- `task_chore_idx` on `chore_id`
- `task_pending_chore_unique`: partial unique index on `chore_id` where `completed_at IS NULL`

The partial unique index enforces at most one pending task per chore. Completed rows are not affected, so a chore can accumulate history.

On chore deletion, all linked tasks are deleted via `ON DELETE CASCADE`.

### TypeScript types

Exported from `src/lib/server/db/schema/tasks.ts`:

- `Chore`
- `NewChore`
- `Task`
- `NewTask`
- `ChoreFrequency`

## Date and Scheduling Rules

Implementation: `src/lib/server/db/api/recurrence.ts`.

- Dates are date-only values in `YYYY-MM-DD` format.
- Date math uses UTC to avoid timezone drift.
- A chore `startDate` must be today or later.
- The first pending task is created with `dueDate = startDate`.
- Monthly and longer intervals preserve the anchor day-of-month and clamp to the end of shorter months.
  - Example: Jan 31 → Feb 28 → Mar 31 → Apr 30.
- Late completion catches up: the schedule advances repeatedly until the next due date is strictly after today.
- Catch-up is capped at 1000 steps and throws if the next occurrence cannot be calculated.

Recurrence examples:

| Frequency     | Current due | Anchor     | Next due   |
| ------------- | ----------- | ---------- | ---------- |
| `weekly`      | 2026-01-01  | 2026-01-01 | 2026-01-08 |
| `monthly`     | 2026-01-31  | 2026-01-31 | 2026-02-28 |
| `monthly`     | 2026-02-28  | 2026-01-31 | 2026-03-31 |
| `quarterly`   | 2026-01-01  | 2026-01-01 | 2026-04-01 |
| `half_yearly` | 2026-01-01  | 2026-01-01 | 2026-07-01 |
| `yearly`      | 2024-02-29  | 2024-02-29 | 2025-02-28 |

### Catch-up example

A weekly chore anchored to `2026-01-01` is completed on `2026-01-20` while its current task was due on `2026-01-01`.

The next due date is calculated by advancing to `2026-01-08`, `2026-01-15`, and finally `2026-01-22`, which is the first occurrence after today.

## Chores API

Implementation: `src/lib/server/db/api/chores.ts`.

### `createChore(input)`

```ts
createChore(input: CreateChoreInput): Promise<{ chore: Chore; nextTask: Task }>
```

Creates the chore and its first pending task in a transaction.

`CreateChoreInput`:

```ts
{
  familyId: string;
  title: string;
  description?: string | null;
  frequency: ChoreFrequency;
  startDate: string;
  assignedTo?: string | null;
  createdBy?: string | null;
}
```

Validation:

- `title` must not be blank.
- `startDate` must be today or later.

### `getChoreById(id)`

```ts
getChoreById(id: number): Promise<Chore | null>
```

### `getChoresByFamily(familyId)`

```ts
getChoresByFamily(familyId: string): Promise<ChoreWithNextTask[]>
```

Returns chores ordered by `nextDueDate`, each with its pending task:

```ts
type ChoreWithNextTask = Chore & {
	nextTask: Task | null;
};
```

### `updateChore(id, input)`

```ts
updateChore(id: number, input: UpdateChoreInput): Promise<Chore | null>
```

`UpdateChoreInput`:

```ts
{
  title?: string;
  description?: string | null;
  frequency?: ChoreFrequency;
  startDate?: string;
  assignedTo?: string | null;
}
```

Behavior:

- Title, description, and assignee changes are also applied to the pending task.
- Completed tasks are not modified.
- If `startDate` is provided, it must be today or later and becomes both the new `startDate` and `nextDueDate`.
- If only `frequency` is provided, the next due date is recalculated using the new frequency and catch-up rules.
- If both are provided, the new `startDate` becomes the next due date.
- The pending task `dueDate` is updated whenever the chore is rescheduled.

### `deleteChore(id)`

```ts
deleteChore(id: number): Promise<{ ok: boolean }>
```

Hard-deletes the chore. Linked task rows, including completed history, are deleted by the database cascade.

### `completeChore(id, completedBy)`

```ts
completeChore(id: number, completedBy?: string | null): Promise<CompleteTaskResult>
```

Convenience wrapper that finds the chore's pending task and completes it with `completeTask`.

Throws if the chore has no pending task.

## Tasks API

Implementation: `src/lib/server/db/api/tasks.ts`.

### `createTask(input)`

```ts
createTask(input: CreateTaskInput): Promise<Task>
```

Creates a one-off task with `chore_id = NULL`.

`CreateTaskInput`:

```ts
{
  familyId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  createdBy?: string | null;
}
```

`dueDate` is optional for one-off tasks.

### `getTaskById(id)`

```ts
getTaskById(id: number): Promise<Task | null>
```

### `getTasksByFamily(familyId, filters)`

```ts
getTasksByFamily(familyId: string, filters?: TaskFilters): Promise<Task[]>
```

`TaskFilters`:

```ts
{
  completed?: boolean;
  from?: string;
  to?: string;
  choreId?: number;
}
```

Returns tasks ordered by `dueDate` ascending.

### `updateTask(id, input)`

```ts
updateTask(id: number, input: UpdateTaskInput): Promise<Task | null>
```

`UpdateTaskInput`:

```ts
{
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  assignedTo?: string | null;
}
```

Only one-off tasks can be updated through this function. Chore tasks must be updated through `updateChore`, otherwise the function throws.

### `deleteTask(id)`

```ts
deleteTask(id: number): Promise<{ ok: boolean }>
```

Only one-off tasks can be deleted through this function. Chore tasks must be deleted through `deleteChore`, otherwise the function throws.

### `getTasksByChore(choreId)`

```ts
getTasksByChore(choreId: number): Promise<Task[]>
```

Returns the chore's pending and completed tasks ordered by due date.

### `getPendingTaskByChore(choreId)`

```ts
getPendingTaskByChore(choreId: number): Promise<Task | null>
```

Returns the single pending task for a chore, if one exists.

### `completeTask(id, completedBy)`

```ts
completeTask(id: number, completedBy?: string | null): Promise<CompleteTaskResult>
```

Runs in a transaction:

1. Atomically marks the task completed only if it is still pending.
2. For a one-off task, returns `{ completed, next: null }`.
3. For a chore task, loads the chore and calculates the next due date using catch-up rules.
4. Updates `chore.nextDueDate`.
5. Inserts the next pending task using the chore's current title, description, and assignee.
6. Returns `{ completed, next }`.

If the task is missing or already completed, the transaction throws.

## UI

### Routes

| Route                        | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `/planner/[id]/tasks`        | Overview of pending tasks and chore instances |
| `/planner/[id]/tasks/create` | Create a one-off task or recurring chore      |

### Overview

Implementation: `src/routes/planner/[id]/tasks/+page.svelte`.

The page load fetches pending tasks and the family's chores in parallel. Chores are used to look up the frequency of each pending chore task.

The toolbar contains:

- a search field that filters by title and description
- a filter button that shows only tasks assigned to the current user or left unassigned
- an add button that navigates to the create page

Tasks are sorted by due date ascending. Undated one-off tasks appear after dated tasks. Search and filtering are client-side.

An empty state is shown when there are no tasks or when the current search/filter has no matches.

### Task card

Implementation: `src/routes/planner/[id]/tasks/task-card.svelte`.

Each card shows:

- a task or chore icon in the header
- the task title
- a check button that completes the task
- the description, assignee, and due date in the body

Clicking the card toggles a footer menu with Edit and Delete buttons. Completing a task, editing it, or deleting it stops click propagation so the card menu does not toggle unexpectedly.

Completing a chore task marks the current task complete and creates the next pending occurrence. Completing a one-off task removes it from the overview.

### Icons

Implementation: `src/routes/planner/[id]/tasks/task-icon.svelte`.

- One-off tasks use `list-todo`.
- Chores use `repeat`.

### Edit dialog

Implementation: `src/routes/planner/[id]/tasks/edit-task-dialog.svelte`.

The dialog updates:

- title
- description
- due date
- assignee, including unassigned
- frequency, for chores only

Editing a chore sends the due date as `startDate` only when the date changed. This allows an overdue chore's title, description, or assignee to be edited without rescheduling it.

Changing a chore's frequency reschedules it using the recurrence rules. If the due date also changed, the new due date takes precedence.

### Delete dialog

Implementation: `src/routes/planner/[id]/tasks/delete-task-dialog.svelte`.

Both one-off tasks and chore cards require confirmation before deletion.

- Deleting a one-off task removes that task.
- Deleting a chore removes the chore definition, its pending task, and all completed task history.

### Create page

Implementation:

- `src/routes/planner/[id]/tasks/create/+page.svelte`
- `src/routes/planner/[id]/tasks/create/create-task-form.svelte`

The form contains:

- title
- description
- due date
- assignee, either unassigned or a family member
- a "Recurring chore" checkbox
- frequency, visible only for chores

The due date defaults to today. It is optional for one-off tasks and required for chores. A chore's first occurrence uses the submitted due date as its schedule anchor.

The form uses the `createTaskAction` remote form. On success, the user is redirected to `/planner/[id]/tasks`.

### Remote actions

Implementation: `src/lib/forms/tasks.remote.ts`.

| Export               | Type      | Purpose                                     |
| -------------------- | --------- | ------------------------------------------- |
| `createTaskAction`   | `form`    | Create a one-off task or chore and redirect |
| `updateTaskAction`   | `command` | Update a task or chore                      |
| `deleteTaskAction`   | `command` | Delete a one-off task or a chore            |
| `completeTaskAction` | `command` | Complete a task                             |

Each action verifies that the current user belongs to the requested family. Assignees must also be family members. Update, delete, and complete actions verify that the target task or chore belongs to that family.

Form schemas live in `src/lib/forms/schema/tasks.ts`.

The UI calls `refreshAll()` after commands so the overview reflects new, updated, completed, and deleted tasks.

## Authorization

The database API is intentionally authorization-agnostic.

Remote actions are responsible for checking:

- the user is authenticated
- the user belongs to the task's family
- the target task or chore belongs to that family
- the user may modify the requested task or chore

The overview page itself is protected by the planner layout and also redirects unauthenticated users to the login page.

## Migration

Generated migration: `drizzle/0004_gorgeous_lethal_legion.sql`.

To regenerate after schema changes:

```sh
bun run db:generate
```

The migration creates the `chore_frequency` enum, the `chore` and `task` tables, foreign keys, indexes, and the partial unique index for pending chore tasks.
