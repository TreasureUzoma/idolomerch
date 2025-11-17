import { Hono } from "hono";
import crypto from "crypto";
import { envConfig } from "../../../config";

const IPN_SECRET = envConfig.NOWPAYMETS_API_KEY;

const webhookRoutes = new Hono();

function sortObject(obj: any): any {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key: string) => {
      const value = obj[key];
      result[key] =
        value && typeof value === "object" && !Array.isArray(value)
          ? sortObject(value)
          : value;
      return result;
    }, {});
}

const verifyIpnSignature = (rawBody: string, signature: string): boolean => {
  if (!IPN_SECRET) {
    return false;
  }

  try {
    const bodyObject = JSON.parse(rawBody);
    const sortedObject = sortObject(bodyObject);
    const sortedJsonString = JSON.stringify(sortedObject);

    const hmac = crypto.createHmac("sha512", IPN_SECRET);
    hmac.update(sortedJsonString);
    const expectedSignature = hmac.digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch (e) {
    return false;
  }
};

webhookRoutes.post("/nowpayments-webhook", async (c) => {
  const receivedSignature = c.req.header("x-nowpayments-sig");

  if (!receivedSignature) {
    return c.text("No signature provided", 401);
  }

  const rawBody = await c.req.raw.text();

  if (!verifyIpnSignature(rawBody, receivedSignature)) {
    return c.text("Invalid signature", 403);
  }

  const paymentData = JSON.parse(rawBody);

  const { payment_status, order_id } = paymentData;

  if (!order_id) {
    return c.text("Missing order_id in payload", 400);
  }

  let newOrderStatus: string | null = null;

  if (payment_status === "finished") {
    newOrderStatus = "processing";
  } else if (
    ["failed", "refunded", "expired", "partially_paid"].includes(payment_status)
  ) {
    newOrderStatus = "failed";
  }

  if (newOrderStatus) {
    // await updateOrderStatus(order_id, newOrderStatus);
  }

  return c.text("IPN received and processed successfully.", 200);
});

export default webhookRoutes;
