import { db } from "..";
import { orders } from "../schema/orders";
import { eq, sql, desc, and } from "drizzle-orm";
import { paginate } from "../../utils/paginations";
import type {
  OrderInputType,
  AdminOrderUpdateInput,
  ProductsParams,
} from "@workspace/validations";
import { currencyConverter } from "../services/currency-converter";

type ServiceResponse<T> = Promise<{
  data?: T;
  error?: string;
  status: "success" | "error";
}>;

type OrderStatus = (typeof orders.status.enumValues)[number];

export const createOrder = async (
  body: OrderInputType & { userId?: string }
): ServiceResponse<typeof orders.$inferSelect> => {
  try {
    const {
      shippingAddress,
      billingAddress,
      currency: sourceCurrency = "USD",
      products,
      userId,
      notes,
      isGift = false,
      userInfo,
      paymentMethod,
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
    const paymentMethodToUse = paymentMethod || "card";

    const inserted = await db
      .insert(orders)
      .values({
        orderNumber,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: paymentMethodToUse,
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

    return { status: "success", data: inserted[0] };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create order";
    return { status: "error", error: message };
  }
};

export const getOrders = async (
  params: ProductsParams,
  lookup?: { id?: string; userId?: string; isAdmin?: boolean }
): ServiceResponse<any> => {
  try {
    const { page = 1, limit = 15, search } = params;
    const isAdmin = lookup?.isAdmin || false;
    const isSingleLookup = lookup && (lookup.id || lookup.userId);
    const offset = isSingleLookup ? 0 : (page - 1) * limit;
    const finalLimit = isSingleLookup ? 1 : limit;

    const conditions = [];

    if (lookup?.id) {
      conditions.push(eq(orders.id, lookup.id));
    }

    if (lookup?.userId && !isAdmin) {
      conditions.push(eq(orders.userId, lookup.userId));
    }

    if (search) {
      conditions.push(eq(orders.orderNumber, search));
    }

    const finalConditions =
      conditions.length > 0 ? and(...conditions) : undefined;

    const ordersQuery = db
      .select()
      .from(orders)
      .where(finalConditions)
      .orderBy(desc(orders.createdAt))
      .limit(finalLimit)
      .offset(offset);

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(finalConditions);

    const result = await paginate(ordersQuery, countQuery, page, finalLimit);
    let orderData = result.data || [];

    if (isSingleLookup) {
      if (orderData.length === 0) {
        throw new Error("Order not found");
      }
      return { status: "success", data: orderData[0] };
    }

    result.data = orderData;
    return { status: "success", data: result };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to retrieve orders";
    return { status: "error", error: message };
  }
};

export const updateOrder = async (
  orderId: string,
  body: AdminOrderUpdateInput
): ServiceResponse<typeof orders.$inferSelect> => {
  try {
    const updatePayload: Partial<typeof orders.$inferInsert> = {};

    if (body.status) {
      updatePayload.status = body.status as OrderStatus;
    }

    if (body.isPaid !== undefined) {
      updatePayload.paymentStatus = body.isPaid ? "paid" : "pending";
    }

    const updated = await db
      .update(orders)
      .set({ ...updatePayload, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updated || updated.length === 0) throw new Error("Order not found");

    return { status: "success", data: updated[0] };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update order";
    return { status: "error", error: message };
  }
};

export const deleteOrder = async (
  orderId: string
): ServiceResponse<{ id: string }> => {
  try {
    const deleted = await db
      .delete(orders)
      .where(eq(orders.id, orderId))
      .returning({ id: orders.id });

    if (!deleted || deleted.length === 0) throw new Error("Order not found");

    return { status: "success", data: deleted[0] };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete order";
    return { status: "error", error: message };
  }
};

export const getOrder = async (
  orderId: string,
  isAdmin: boolean = false
): ServiceResponse<typeof orders.$inferSelect> => {
  try {
    if (!isAdmin) {
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) {
      throw new Error("Order not found");
    }

    return { status: "success", data: order };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to retrieve order";
    return { status: "error", error: message };
  }
};
