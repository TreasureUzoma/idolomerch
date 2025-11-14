import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  productsQuerySchema,
  isValidSlug,
  isValidCurrency,
} from "@workspace/validations";
import { validationErrorResponse } from "../../../utils/validate-error-res";
import {
  getAllProducts,
  getProductBySlugOrId,
} from "../../../db/services/products";

const productsRoutes = new Hono();

productsRoutes.get("/", zValidator("query", productsQuerySchema), async (c) => {
  const params = c.req.valid("query");

  try {
    const result = await getAllProducts(params);
    return c.json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return c.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
        data: null,
      },
      500
    );
  }
});

productsRoutes.get(
  "/:slug",
  zValidator("query", isValidCurrency),
  zValidator("param", isValidSlug, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const { slug } = c.req.valid("param");
    const { currency } = c.req.valid("query");

    try {
      const product = await getProductBySlugOrId({ slug, currency });

      return c.json({ status: "success", data: product });
    } catch (err) {
      return c.json(
        {
          status: "error",
          message: err instanceof Error ? err.message : "Something went wrong",
          data: null,
        },
        404
      );
    }
  }
);

export default productsRoutes;
