CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'declined', 'expired');--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"family_id" text NOT NULL,
	"invited_user_id" text,
	"inviter_user_id" text NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_family_id_family_plan_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_invited_user_id_user_id_fk" FOREIGN KEY ("invited_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_user_id_user_id_fk" FOREIGN KEY ("inviter_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;