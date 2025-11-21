import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  createOrderSchema,
  isValidUUID,
  type CurrencyType,
  type ProductSortType,
} from "@workspace/validations";
import { Hono } from "hono";
import { validationErrorResponse } from "../../../utils/validate-error-res";
import { createOrder, getOrder } from "../../../db/services/orders";
import { envConfig } from "../../../config";
import { getProducts } from "../../../db/services/products";

type CreateOrderSchemaType = z.infer<typeof createOrderSchema>;

interface ProductFromDB {
  id: string;
  price: number | string;
  stockQuantity: number;
  slug: string;
}

interface CreateOrderInput extends CreateOrderSchemaType {
  totalAmount: number;
  currency: CurrencyType;
}

interface CartItemInput {
  slug: string;
  quantity: number;
}

interface NowPaymentsError {
  message: string;
}

interface NowPaymentsSuccess {
  invoice_url: string;
}

const orderRoutes = new Hono();

const NOWPAYMENTS_API_KEY = envConfig.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_URL = "https://api.nowpayments.io/v1/invoice";

const calculateFinalOrderAmount = async (
  items: CartItemInput[]
): Promise<{ total: number; currency: CurrencyType }> => {
  const productLookupParams = {
    currency: "USD" as CurrencyType,
    // these extra params arent actually needed in the service function, only here to satisfy weird types
    page: 1,
    limit: 1,
    sort: "newest" as ProductSortType,
  };

  const productPromises = items.map((item) => {
    const lookup = { slug: item.slug, isSingleLookup: true };
    return getProducts(productLookupParams, lookup) as any;
  });

  const results = await Promise.all(productPromises);
  let totalAmount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const productsResult = results[i];

    if (productsResult.status === "error") {
      throw new Error(
        `Failed to retrieve product prices: ${productsResult.error}`
      );
    }
    if (!productsResult.data) {
      throw new Error(
        `Failed to retrieve product prices for slug ${item.slug}: Product not found.`
      );
    }

    const product: ProductFromDB = productsResult.data;
    if (item.quantity <= 0 || product.stockQuantity < item.quantity) {
      throw new Error(
        `Invalid quantity or out-of-stock for product slug ${item.slug}`
      );
    }
    totalAmount += Number(product.price) * item.quantity;
  }

  const finalTotal = Math.round(totalAmount * 100) / 100;

  return { total: finalTotal, currency: "USD" };
};

orderRoutes.post("/", zValidator("json", createOrderSchema), async (c) => {
  const body = c.req.valid("json") as CreateOrderSchemaType;

  try {
    const { total: calculatedTotal, currency: finalCurrency } =
      await calculateFinalOrderAmount(body.products);

    if (calculatedTotal <= 0) {
      return c.json({ error: "Order total must be greater than zero." }, 400);
    }

    const newOrderResponse = (await createOrder({
      ...body,
      totalAmount: calculatedTotal,
      currency: finalCurrency,
    } as CreateOrderInput)) as any;

    if (newOrderResponse.status === "error" || !newOrderResponse.data?.id) {
      throw new Error(
        `Failed to save order to database: ${newOrderResponse.error || "No ID returned."}`
      );
    }

    const newOrder = newOrderResponse.data;
    const orderIdString = newOrder.id.toString();

    const invoicePayload = {
      price_amount: calculatedTotal,
      price_currency: finalCurrency,
      order_id: orderIdString,
      order_description: `Order #${orderIdString}`,
      ipn_callback_url: envConfig.SERVER_URL + "/api/v1/webhooks/now-payment",
      success_url: envConfig.APP_URL + `/checkout/success?id=${orderIdString}`,
      cancel_url: envConfig.APP_URL + "/checkout?error=cancel-error",
    };

    const nowPaymentsResponse = await fetch(NOWPAYMENTS_URL, {
      method: "POST",
      headers: {
        "x-api-key": NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoicePayload),
    });

    if (!nowPaymentsResponse.ok) {
      const errorBody = (await nowPaymentsResponse.json()) as NowPaymentsError;
      throw new Error(
        `NOWPayments API Error: ${errorBody.message || nowPaymentsResponse.statusText}`
      );
    }

    const data = (await nowPaymentsResponse.json()) as NowPaymentsSuccess;
    const checkoutLink = data.invoice_url;

    return c.json({ ...newOrderResponse, checkoutLink }, 201);
  } catch (error) {
    console.error("Error creating order:", error);

    let errorMessage = "Failed to create order";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return c.json({ error: errorMessage }, 400);
  }
});

orderRoutes.get("/:id", zValidator("param", isValidUUID), async (c) => {
  const { id } = c.req.valid("param");

  const data = await getOrder(id, false);
  return c.json(data, data.status === "error" ? 400 : 200);
});

export default orderRoutes;
