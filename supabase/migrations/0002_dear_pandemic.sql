CREATE TABLE IF NOT EXISTS "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userid" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "exercises";