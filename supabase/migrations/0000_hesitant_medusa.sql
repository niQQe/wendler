CREATE TABLE IF NOT EXISTS "exercises" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userid" text NOT NULL,
	"name" text NOT NULL,
	"max_weight" double precision NOT NULL,
	"created_at" timestamp NOT NULL
);
