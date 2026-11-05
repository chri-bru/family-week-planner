# Tasks and Chores UI

## Decisions

- [x] Use remote `form()` for create and `command()` for update, delete, and complete.
- [x] One-off task due dates are optional; undated tasks sort after dated tasks.
- [x] Deleting a chore deletes the chore, its pending task, and all completed history.
- [x] Search filters title and description client-side.
- [x] The filter toggle shows only tasks assigned to the current user or unassigned.
- [x] Chore editing supports title, description, due date, assignee, and frequency.
- [x] Chore due-date edits map to `startDate` and only reschedule when the date changes.

## Implementation

- [x] Create `src/lib/forms/schema/tasks.ts`.
- [x] Create `src/lib/forms/tasks.remote.ts`.
- [x] Add family membership and resource ownership checks to remote actions.
- [x] Add `src/routes/planner/[id]/tasks/+page.server.ts`.
- [x] Add the tasks overview page with search, filter, and add controls.
- [x] Add `task-card.svelte` with completion, edit, and delete actions.
- [x] Add `task-icon.svelte` with distinct one-off and chore icons.
- [x] Add `edit-task-dialog.svelte`.
- [x] Add `delete-task-dialog.svelte`.
- [x] Add `tasks/create/+page.svelte`.
- [x] Add `tasks/create/create-task-form.svelte`.
- [x] Enable the Tasks item in the bottom navigation.
- [x] Document the UI components and user flow in `TASKS_AND_CHORES.md`.

## Verification

- [x] Run the Svelte autofixer on all changed `.svelte` files.
- [x] Run `bun run check`.
- [x] Run targeted Prettier and ESLint checks.
- [x] Run `bun run build`.
- [ ] Manually verify create, search, filter, complete, edit, delete, and undated task ordering.
