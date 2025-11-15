import { zValidator } from "@hono/zod-validator";
import { createOrderSchema } from "@workspace/validations";
import { Hono } from "hono";
import { validationErrorResponse } from "../../../utils/validate-error-res";
import { createOrder } from "../../../db/services/orders";

const orderRoutes = new Hono();

orderRoutes.post(
  "/",
  zValidator("json", createOrderSchema, (result, c) => {
    if (!result.success) return validationErrorResponse(c, result.error);
  }),
  async (c) => {
    const body = c.req.valid("json");

    try {
      const newOrder = await createOrder(body);

      return c.json(newOrder, 201);
    } catch (error) {
      console.error("Error creating order:", error);

      let errorMessage = "Failed to create order";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return c.json({ error: errorMessage }, 400);
    }
  }
);

export default orderRoutes;
