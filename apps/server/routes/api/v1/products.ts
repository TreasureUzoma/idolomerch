import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  productsParamsSchema,
  isValidCurrency,
  isValidSlug,
} from "@workspace/validations";

import { validationErrorResponse } from "../../../utils/validate-error-res";
import { getProducts } from "../../../db/services/products";
import { currencyConverter } from "../../../db/services/currency-converter";

const productsRoutes = new Hono();

productsRoutes.get("/rates", async (c) => {
  const to = c.req.query("to") || "USD";
  try {
    const rate = await currencyConverter.getRate("USD", to);
    return c.json({ status: "success", rate });
  } catch (e) {
    return c.json(
      {
        status: "error",
        error: e instanceof Error ? e.message : "Failed to get rate",
      },
      400
    );
  }
});

productsRoutes.get(
  "/",
  zValidator("query", productsParamsSchema),
  async (c) => {
    const params = c.req.valid("query");

    const result = await getProducts(params);

    if (result.status === "error") {
      return c.json(
        {
          status: "error",
          message: result.error || "Failed to retrieve product list",
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

    const defaultParams = productsParamsSchema.parse({});

    const result = await getProducts(
      {
        ...defaultParams,
        currency: currency,
      },
      { slug: slug }
    );

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

export default productsRoutes;
