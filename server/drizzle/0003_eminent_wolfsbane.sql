ALTER TABLE "inventory" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;