import {
  pgTable,
  text,
  uuid,
  serial,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
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
  role: userRoleEnum("role").default("user").notNull(),
});

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    serial: serial("serial").primaryKey(),
    id: uuid("id").defaultRandom().notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revoked: boolean("revoked").notNull().default(false),
    userAgent: text("user_agent").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("refresh_tokens_user_idx").on(table.userId),
  })
);
