import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  productsParamsSchema,
  productCreateSchema,
  productUpdateSchema,
  isValidUUID,
} from "@workspace/validations";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../../../db/services/products";
import { validationErrorResponse } from "../../../../utils/validate-error-res";

const adminProductsRoutes = new Hono();

adminProductsRoutes.get(
  "/",
  zValidator("query", productsParamsSchema),
  async (c) => {
    const params = c.req.valid("query");

    const result = await getProducts(params, { isAdmin: true });

    if (result.status === "error") {
      return c.json(
        {
          status: "error",
          message: result.error || "Failed to retrieve admin product list",
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

adminProductsRoutes.post(
  "/",
  zValidator("json", productCreateSchema),
  async (c) => {
    const body = c.req.valid("json");

    const result = await createProduct(body);

    if (result.status === "error") {
      return c.json(
        {
          status: "error",
          message: result.error || "Failed to create product",
          data: null,
        },
        400
      );
    }

    return c.json({ status: "success", data: result.data }, 201);
  }
);

adminProductsRoutes.get(
  "/:id",
  zValidator("param", isValidUUID, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const defaultParams = productsParamsSchema.parse({});

    const result = await getProducts(defaultParams, { id: id, isAdmin: true });

    if (result.status === "error") {
      return c.json(
        {
          status: "error",
          message: result.error || "Product not found",
          data: null,
        },
        404
      );
    }

    return c.json({ status: "success", data: result.data });
  }
);

adminProductsRoutes.put(
  "/:id",
  zValidator("param", isValidUUID),
  zValidator("json", productUpdateSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const result = await updateProduct(id, body);

    if (result.status === "error") {
      const status = result.error?.includes("not found") ? 404 : 400;
      return c.json(
        {
          status: "error",
          message: result.error || "Failed to update product",
          data: null,
        },
        status
      );
    }

    return c.json({ status: "success", data: result.data });
  }
);

adminProductsRoutes.delete(
  "/:id",
  zValidator("param", isValidUUID),
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await deleteProduct(id);

    if (result.status === "error") {
      return c.json(
        {
          status: "error",
          message: result.error || "Failed to delete product",
          data: null,
        },
        404
      );
    }

    return c.json({ status: "success", data: null });
  }
);

export default adminProductsRoutes;
