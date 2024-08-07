CREATE TABLE IF NOT EXISTS "exercises" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userid" text NOT NULL,
	"name" text NOT NULL,
	"weight" double precision NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "profile";