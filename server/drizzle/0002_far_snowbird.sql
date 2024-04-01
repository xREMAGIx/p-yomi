ALTER TABLE "warehouse" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouse" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;