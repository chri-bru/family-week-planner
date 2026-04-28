ALTER TABLE "family_plan" ADD COLUMN "invitationToken" varchar(64);--> statement-breakpoint
ALTER TABLE "family_plan" ADD CONSTRAINT "family_plan_invitationToken_unique" UNIQUE("invitationToken");