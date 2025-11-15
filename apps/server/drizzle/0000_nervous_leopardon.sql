CREATE TYPE "public"."currency" AS ENUM('USD', 'EUR');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_status" AS ENUM('unfulfilled', 'fulfilled', 'partially_fulfilled', 'cancelled', 'returned');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('card', 'paypal', 'bank_transfer', 'cash_on_delivery', 'btc', 'usdt', 'usdc', 'sol');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('hoodies', 'shirts', 'caps', 'stickers', 'posters', 'accessories');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('active', 'discontinued', 'archived', 'draft');--> statement-breakpoint
CREATE TYPE "public"."shipping_method" AS ENUM('standard', 'express', 'same_day', 'pickup');--> statement-breakpoint
CREATE TYPE "public"."user_auth_method" AS ENUM('email', 'google', 'github');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'superadmin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'read-only');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private', 'members-only');--> statement-breakpoint
CREATE TABLE "orders" (
	"serial" serial PRIMARY KEY NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"payment_method" "payment_method" DEFAULT 'card' NOT NULL,
	"shipping_method" "shipping_method" DEFAULT 'standard' NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"shipping_fee" numeric DEFAULT '0' NOT NULL,
	"discount_amount" numeric DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"shipping_address" jsonb,
	"user_id" uuid,
	"user_info" jsonb,
	"billing_address" jsonb,
	"notes" text,
	"is_gift" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_id_unique" UNIQUE("id"),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"serial" serial PRIMARY KEY NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"payment_method" "payment_method" DEFAULT 'card' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"transaction_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"serial" serial PRIMARY KEY NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"visibility" "visibility" DEFAULT 'private' NOT NULL,
	"category" "product_category" NOT NULL,
	"sku" text NOT NULL,
	"barcode" text,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"cost_price" numeric(12, 2) NOT NULL,
	"sale_price" numeric(12, 2),
	"discount_percentage" integer DEFAULT 0,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"inventory_tracking" boolean DEFAULT true NOT NULL,
	"low_stock_threshold" integer DEFAULT 5,
	"sizes" jsonb,
	"color" text,
	"limited_edition" boolean DEFAULT false NOT NULL,
	"drop_date" timestamp,
	"weight" numeric(8, 2),
	"requires_shipping" boolean DEFAULT true NOT NULL,
	"main_image" text,
	"gallery_images" jsonb,
	"tags" jsonb,
	"attributes" jsonb,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_id_unique" UNIQUE("id"),
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"serial" serial PRIMARY KEY NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"user_agent" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"serial" serial PRIMARY KEY NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified_at" timestamp,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"auth_method" "user_auth_method" DEFAULT 'email',
	"status" "user_status" DEFAULT 'active',
	"role" "user_role" DEFAULT 'user',
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_idx" ON "refresh_tokens" USING btree ("user_id");