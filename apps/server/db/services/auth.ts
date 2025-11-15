import type { Login } from "@workspace/validations";
import { db } from "..";
import { refreshTokens, users } from "../schema/users";
import { eq, type InferInsertModel } from "drizzle-orm";
import { meta } from "@workspace/constants";

export type Role = "user" | "admin" | "superadmin";

export const login = async (
  body: Login
): Promise<{
  status: "success" | "error";
  data: null | {
    id: string;
    email: string;
    name?: string;
    role: Role;
  };
  message?: string;
}> => {
  const { email, password } = body;
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const foundUser = rows[0];
  if (!foundUser || !foundUser.passwordHash) {
    return {
      status: "error",
      message: "Invalid email or password",
      data: null,
    };
  }
  const valid = await Bun.password.verify(password, foundUser.passwordHash);
  if (!valid) {
    return {
      status: "error",
      message: "Invalid email or password",
      data: null,
    };
  }

  const { passwordHash: _, createdAt, updatedAt, ...safeUser } = foundUser;

  return {
    status: "success",
    message: "Password matched",
    data: {
      id: safeUser.id,
      email: safeUser.email,
      name: meta.fullName,
      role: safeUser.role,
    },
  };
};

export const signup = async (payload: Login) => {
  const { email, password } = payload;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      status: "error",
      message: "Email already in use",
      data: null,
    };
  }

  const hashedPassword = await Bun.password.hash(password);

  await db
    .insert(users)
    .values({
      email,
      passwordHash: hashedPassword,
      role: "superadmin",
    })
    .returning();

  return {
    status: "success",
    message: "Signup successful",
  };
};

export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;
export const insertAuthRefreshToken = async (data: NewRefreshToken) => {
  await db.insert(refreshTokens).values({
    token: data.token,
    expiresAt: data.expiresAt,
    revoked: false,
    userId: data.userId,
    userAgent: data.userAgent,
  });
};

export const deleteAuthRefreshToken = async (id: string) => {
  await db.delete(refreshTokens).where(eq(refreshTokens.id, id));
};
