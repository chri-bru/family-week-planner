DROP INDEX "task_pending_chore_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "task_pending_chore_unique" ON "task" ("chore_id") WHERE "completed_at" IS NULL;