import { pgTable, text, uuid, serial, timestamp } from "drizzle-orm/pg-core";
import { userAuthMethodEnum, userRoleEnum, userStatusEnum } from "./enums";

export const users = pgTable("users", {
  serial: serial("serial").primaryKey(),
  id: uuid("id").defaultRandom().notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  emailVerifiedAt: timestamp("email_verified_at"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().notNull(),
  authMethod: userAuthMethodEnum("auth_method").default("email"),
  status: userStatusEnum("status").default("active"),
  role: userRoleEnum("role").default("user"),
});
