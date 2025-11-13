import {
  pgTable,
  serial,
  uuid,
  text,
  numeric,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  currencyEnum,
  orderStatusEnum,
  paymentStatusEnum,
  paymentMethodEnum,
  shippingMethodEnum,
} from "./enums";
import { users } from "./users";

export const orders = pgTable("orders", {
  serial: serial("serial").primaryKey(),
  id: uuid("id").defaultRandom().notNull().unique(),

  orderNumber: text("order_number").notNull().unique(),

  status: orderStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status")
    .notNull()
    .default("pending"),
  paymentMethod: paymentMethodEnum("payment_method")
    .notNull()
    .default("credit_card"),
  shippingMethod: shippingMethodEnum("shipping_method")
    .notNull()
    .default("standard"),

  currency: currencyEnum("currency").notNull().default("USD"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee").notNull().default("0"),
  discountAmount: numeric("discount_amount").notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),

  shippingAddress: jsonb("shipping_address").$type<{
    fullName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    phone?: string;
  }>(),

  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),

  userInfo: jsonb("user_info").$type<{
    fullName: string;
    email: string;
    phoneNumber?: string;
  }>(), // if not null then it means item was purchased by a  (user without an account)

  billingAddress: jsonb("billing_address").$type<{
    fullName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    phone?: string;
  }>(),

  notes: text("notes"),
  isGift: boolean("is_gift").notNull().default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
