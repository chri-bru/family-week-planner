CREATE TYPE "public"."chore_frequency" AS ENUM('weekly', 'monthly', 'quarterly', 'half_yearly', 'yearly');--> statement-breakpoint
CREATE TABLE "chore" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chore_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"family" text NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"frequency" "chore_frequency" NOT NULL,
	"start_date" date NOT NULL,
	"next_due_date" date NOT NULL,
	"assigned_to" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "task_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"family" text NOT NULL,
	"chore_id" integer,
	"title" varchar(256) NOT NULL,
	"description" text,
	"due_date" date,
	"assigned_to" text,
	"completed_at" timestamp,
	"completed_by" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chore" ADD CONSTRAINT "chore_family_family_plan_id_fk" FOREIGN KEY ("family") REFERENCES "public"."family_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chore" ADD CONSTRAINT "chore_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chore" ADD CONSTRAINT "chore_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_family_family_plan_id_fk" FOREIGN KEY ("family") REFERENCES "public"."family_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_chore_id_chore_id_fk" FOREIGN KEY ("chore_id") REFERENCES "public"."chore"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_completed_by_user_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chore_family_idx" ON "chore" USING btree ("family");--> statement-breakpoint
CREATE INDEX "task_family_due_idx" ON "task" USING btree ("family","due_date");--> statement-breakpoint
CREATE INDEX "task_chore_idx" ON "task" USING btree ("chore_id");--> statement-breakpoint
CREATE UNIQUE INDEX "task_pending_chore_unique" ON "task" USING btree ("chore_id") WHERE "task"."completed_at" IS NULL;