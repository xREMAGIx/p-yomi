ALTER TABLE "order" ADD COLUMN "code" varchar(256);--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "code" varchar(256);--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "note" text;