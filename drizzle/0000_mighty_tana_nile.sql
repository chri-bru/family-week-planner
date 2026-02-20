CREATE TYPE "public"."type" AS ENUM('breakfast', 'dinner', 'lunch', 'special', 'snack');--> statement-breakpoint
CREATE TABLE "family_plan" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "family_plan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "member_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"family" integer,
	"user" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"kc_id" integer,
	CONSTRAINT "user_kc_id_unique" UNIQUE("kc_id")
);
--> statement-breakpoint
CREATE TABLE "meal" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "meal_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"type" "type",
	"family" integer
);
--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_family_family_plan_id_fk" FOREIGN KEY ("family") REFERENCES "public"."family_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal" ADD CONSTRAINT "meal_family_family_plan_id_fk" FOREIGN KEY ("family") REFERENCES "public"."family_plan"("id") ON DELETE no action ON UPDATE no action;