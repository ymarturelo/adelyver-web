CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"status" text NOT NULL,
	"package_cost" integer DEFAULT 0 NOT NULL,
	"shipping_cost" integer DEFAULT 0 NOT NULL,
	"invested_amount" integer DEFAULT 0 NOT NULL,
	"paid_amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"store_order_id" text NOT NULL,
	"url" text NOT NULL,
	"name" text NOT NULL,
	"tracking_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "admin_full_access" ON "orders" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_admin()) WITH CHECK (public.is_admin());--> statement-breakpoint
CREATE POLICY "user_view_own_orders" ON "orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.get_my_id() = "orders"."client_id");--> statement-breakpoint
CREATE POLICY "user_create_own_orders" ON "orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (public.get_my_id() = "orders"."client_id");--> statement-breakpoint
CREATE POLICY "admin_full_access" ON "products" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_admin()) WITH CHECK (public.is_admin());--> statement-breakpoint
CREATE POLICY "user_view_order_products" ON "products" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
        select 1 from "orders" 
        where "orders"."id" = "products"."order_id" 
        and "orders"."client_id" = public.get_my_id()
      ));