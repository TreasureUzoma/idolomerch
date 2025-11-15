import { Hono } from "hono";
import { serve } from "bun";
import { logger } from "hono/logger";
import productsRoutes from "./routes/api/v1/products";
import { envConfig } from "./config";
import orderRoutes from "./routes/api/v1/orders";
import adminAuthRoutes from "./routes/api/v1/admin/auth";
import adminOrdersRoutes from "./routes/api/v1/admin/orders";
import adminProductsRoutes from "./routes/api/v1/admin/products";
import { withAdminAuth } from "./middlewares/admin-session";
import { rateLimiter } from "./middlewares/rate-limiter";
import uploadRoutes from "./routes/api/v1/admin/upload";

const app = new Hono();

app.get("/", (c) => c.text("Hello from the server!"));

const v1 = new Hono().basePath("/api/v1");
const admin = new Hono().basePath("/api/v1/admin");

app.use(logger());

app.use("*", rateLimiter(60 * 1000, 10));

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

v1.get("/health", (c) => {
  return c.json({ message: "Server is healthy!" });
});

v1.route("/products", productsRoutes);
v1.route("/orders", orderRoutes);

// admin
admin.route("/auth", adminAuthRoutes);

admin.use(withAdminAuth);
admin.route("/orders", adminOrdersRoutes);
admin.route("/products", adminProductsRoutes);
admin.route("/upload", uploadRoutes);

app.route("/", v1);
app.route("/", admin);

const server = serve({
  port: envConfig.PORT,
  fetch: app.fetch,
});

console.log(`Server is running on http://localhost:${server.port}`);
