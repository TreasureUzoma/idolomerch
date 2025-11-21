import { Hono } from "hono";
import { envConfig } from "../../../../config";
import { updateOrder } from "../../../../db/services/orders";

const webhookOrderRoutes = new Hono();

interface NowPaymentsIPN {
  payment_id: number;
  payment_status: string;
  order_id: string;
  pay_currency: string;
}

webhookOrderRoutes.post("/now-payment", async (c) => {
  const ipnSecret = envConfig.NOWPAYMENTS_API_KEY;
  const receivedSecret = c.req.header("x-api-key");

  if (receivedSecret !== ipnSecret) {
    console.error("Webhook Error: Invalid IPN secret received.");
    return c.json({ error: "Unauthorized" }, 401);
  }

  let payload: NowPaymentsIPN;
  try {
    payload = await c.req.json();
  } catch (e) {
    console.error("Webhook Error: Could not parse JSON body.", e);
    return c.json({ error: "Invalid payload format" }, 400);
  }

  c.status(200);
  c.header("Content-Type", "application/json");

  try {
    const { order_id, payment_status } = payload;

    console.log(
      `Received IPN for Order ID ${order_id} with status: ${payment_status}`
    );

    if (payment_status === "finished") {
      console.log(`Payment confirmed for order ${order_id}. Updating DB.`);

      const updateResult = await updateOrder(order_id, {
        status: "processing",
        paymentMethod: "btc", // fixed to btc for now
      });

      if (updateResult.status === "error") {
        console.error(
          `DB Update failed for Order ${order_id}: ${updateResult.error}`
        );
      }
    } else if (payment_status === "failed" || payment_status === "expired") {
      console.log(`Payment failed/expired for order ${order_id}. Updating DB.`);
      await updateOrder(order_id, {
        status: "cancelled",
      });
    }
  } catch (error) {
    console.error(`[CRITICAL] Asynchronous webhook processing failed:`, error);
  }

  return c.res;
});

export default webhookOrderRoutes;
