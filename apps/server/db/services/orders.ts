import { db } from "..";
import { orders } from "../schema/orders";
import { eq, sql, desc } from "drizzle-orm";
import { paginate } from "../../utils/paginations";
import type { OrderInputType } from "@workspace/validations";
import { currencyConverter } from "../services/currency-converter";

export const createOrder = async (
  body: OrderInputType & { userId?: string }
) => {
  const {
    shippingAddress,
    billingAddress,
    currency: sourceCurrency = "USD",
    products,
    userId,
    notes,
    isGift = false,
    userInfo,
  } = body;

  if (!products || products.length === 0)
    throw new Error("At least one product is required");

  const TARGET_CURRENCY = "USD";
  let conversionRate = 1;

  if (sourceCurrency !== TARGET_CURRENCY) {
    conversionRate = await currencyConverter.getRate(
      sourceCurrency,
      TARGET_CURRENCY
    );
  }

  const subtotal = products.reduce((acc, p) => {
    // @ts-expect-error
    if (!("price" in p)) throw new Error(`Product ${p.slug} missing price`);

    const priceInUSD = Number(p.price) * conversionRate;

    return acc + priceInUSD * (p.quantity || 1);
  }, 0);

  const shippingFee = 0;
  const discountAmount = 0;
  const total = subtotal + shippingFee - discountAmount;

  const orderNumber = `ORD-${Date.now()}`;

  const inserted = await db
    .insert(orders)
    .values({
      orderNumber,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "card",
      shippingMethod: "standard",
      currency: TARGET_CURRENCY,
      subtotal: subtotal.toFixed(2),
      shippingFee: shippingFee.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      total: total.toFixed(2),
      shippingAddress,
      billingAddress,
      userId,
      userInfo,
      notes,
      isGift,
    })
    .returning();

  return inserted[0];
};

export const getOrders = async (page = 1, limit = 15) => {
  const offset = (page - 1) * limit;

  const ordersQuery = db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  const countQuery = db.select({ count: sql<number>`count(*)` }).from(orders);

  const result = await paginate(ordersQuery, countQuery, page, limit);
  return result;
};

export const updateOrderStatus = async (
  orderId: string,
  status: (typeof orders.status.enumValues)[number]
) => {
  const updated = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId))
    .returning();

  if (!updated || updated.length === 0) throw new Error("Order not found");
  return updated[0];
};
