import {
  pgTable,
  serial,
  uuid,
  numeric,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { currencyEnum, paymentStatusEnum, paymentMethodEnum } from "./enums";
import { orders } from "./orders";

export const payments = pgTable("payments", {
  serial: serial("serial").primaryKey(),
  id: uuid("id").defaultRandom().notNull().unique(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  amount: numeric("amount").notNull(),
  currency: currencyEnum("currency").notNull().default("USD"),
  paymentMethod: paymentMethodEnum("payment_method").notNull().default("card"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  transactionId: text("transaction_id").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
