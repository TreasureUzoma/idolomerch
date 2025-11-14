import { Hono } from "hono";
import { serve } from "bun";
import { logger } from "hono/logger";
import productsRoutes from "./routes/api/v1/products";
import { envConfig } from "./config";
import orderRoutes from "./routes/api/v1/orders";

const app = new Hono();

app.get("/", (c) => c.text("Hello from the server!"));

const v1 = new Hono().basePath("/api/v1");

app.use(logger());

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404);
});

app.onError((err, c) => {
  return c.json(
    {
      status: "error",
      message: err.message || "Internal server error",
      data: null,
    },
    500
  );
});

v1.route("/products", productsRoutes);
v1.route("/orders", orderRoutes);

app.route("/", v1);

const server = serve({
  port: envConfig.PORT,
  fetch: app.fetch,
});

console.log(`Server is running on http://localhost:${server.port}`);
