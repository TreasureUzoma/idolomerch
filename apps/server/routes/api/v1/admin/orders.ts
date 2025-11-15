import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  productsParamsSchema,
  adminOrderUpdateSchema,
  isValidUUID,
} from "@workspace/validations";
import {
  deleteOrder,
  getOrders,
  updateOrder,
} from "../../../../db/services/orders";

const adminOrdersRoutes = new Hono();

adminOrdersRoutes.get(
  "/",
  zValidator("query", productsParamsSchema),
  async (c) => {
    const params = c.req.valid("query");

    const result = await getOrders(params, { isAdmin: true });

    if (result.status === "error") {
      return c.json(
        {
          status: "error",
          message: result.error || "Failed to retrieve order list",
          data: null,
        },
        500
      );
    }

    return c.json({
      status: "success",
      data: result.data,
    });
  }
);

adminOrdersRoutes.get("/:id", zValidator("param", isValidUUID), async (c) => {
  const { id } = c.req.valid("param");

  const defaultParams = productsParamsSchema.parse({});

  const result = await getOrders(defaultParams, { id: id, isAdmin: true });

  if (result.status === "error") {
    return c.json(
      {
        status: "error",
        message: result.error || "Order not found",
        data: null,
      },
      404
    );
  }

  return c.json({ status: "success", data: result.data });
});

adminOrdersRoutes.put(
  "/:id",
  zValidator("param", isValidUUID),
  zValidator("json", adminOrderUpdateSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const result = await updateOrder(id, body);

    if (result.status === "error") {
      const status = result.error?.includes("not found") ? 404 : 400;
      return c.json(
        {
          status: "error",
          message: result.error || "Failed to update order",
          data: null,
        },
        status
      );
    }

    return c.json({ status: "success", data: result.data });
  }
);

adminOrdersRoutes.delete(
  "/:id",
  zValidator("param", isValidUUID),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await deleteOrder(id);

    if (result.status === "error") {
      return c.json(
        {
          status: "error",
          message: result.error || "Failed to delete order",
          data: null,
        },
        404
      );
    }

    return c.json({ status: "success", data: null }, { status: 200 });
  }
);

export default adminOrdersRoutes;
