ALTER TABLE "auth"."users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "auth"."users" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_client_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending_review';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "tracking_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shop_cart_url" text NOT NULL;