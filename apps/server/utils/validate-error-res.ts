import type { Context } from "hono";
import type { ZodError } from "zod";

export const validationErrorResponse = (c: Context, error: ZodError) => {
  const message = error.errors.map((err) => err.message).join(", ");
  return c.json(
    {
      status: "error",
      message,
      data: null,
    },
    400
  );
};
