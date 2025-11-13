import { pgEnum } from "drizzle-orm/pg-core";

export const userAuthMethodEnum = pgEnum("user_auth_method", [
  "email",
  "google",
  "github",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "suspended",
  "read-only",
]);

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
  "superadmin",
]);

export const currencyEnum = pgEnum("currency", ["USD", "EUR"]);

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "discontinued",
  "archived",
  "draft",
]);

export const visibilityEnum = pgEnum("visibility", [
  "public",
  "private",
  "members-only",
]);

export const productCategoryEnum = pgEnum("product_category", [
  "electronics",
  "clothing",
  "home_appliances",
  "books",
  "toys",
  "sports_equipment",
  "beauty_products",
  "automotive",
  "groceries",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "credit_card",
  "debit_card",
  "paypal",
  "bank_transfer",
  "cash_on_delivery",
  "btc",
  "usdt",
  "usdc",
  "sol",
]);

export const shippingMethodEnum = pgEnum("shipping_method", [
  "standard",
  "express",
  "same_day",
  "pickup",
]);

export const fulfillmentStatusEnum = pgEnum("fulfillment_status", [
  "unfulfilled",
  "fulfilled",
  "partially_fulfilled",
  "cancelled",
  "returned",
]);
