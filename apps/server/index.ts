import { Hono, type Context } from "hono";
import { logger } from "hono/logger";
import productsRoutes from "./routes/api/v1/products";
import { envConfig } from "./config";
import orderRoutes from "./routes/api/v1/orders";
import adminAuthRoutes from "./routes/api/v1/admin/auth";
import adminOrdersRoutes from "./routes/api/v1/admin/orders";
import adminProductsRoutes from "./routes/api/v1/admin/products";
import { withAdminAuth } from "./middlewares/admin-session";
import { rateLimiter } from "./middlewares/rate-limiter";
import { cors } from "hono/cors";
import uploadRoutes from "./routes/api/v1/admin/upload";
import type { AuthType } from "./types";
import webhookOrderRoutes from "./routes/api/v1/webhooks/order";

const app = new Hono();

const allowedOrigins = [envConfig.APP_URL, envConfig.ADMIN_APP_URL];

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "";
      return allowedOrigins.includes(origin) ? origin : "";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
    credentials: true,
  })
);

app.get("/", (c) => c.text("Hello from the server!"));

const v1 = new Hono().basePath("/api/v1");
const admin = new Hono().basePath("/api/v1/admin");

app.use(logger());

app.use("*", rateLimiter(60 * 1000, 100));

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
v1.route("/webhooks/now-payment", webhookOrderRoutes);

// admin
admin.route("/auth", adminAuthRoutes);

admin.use(withAdminAuth);

admin.get("/session", (c: Context) => {
  const user = c.get("user") as AuthType | undefined;
  return c.json({
    status: "success",
    data: user ?? null,
    message: "Fetched User Session Successfully",
  });
});
admin.route("/orders", adminOrdersRoutes);
admin.route("/products", adminProductsRoutes);
admin.route("/upload", uploadRoutes);

app.route("/", v1);
app.route("/", admin);

export default app;

// const server = serve({
//   port: envConfig.PORT,
//   fetch: app.fetch,
// });

// console.log(`Server is running on http://localhost:${server.port}`);

// to generate a new password, run
// const hasedPwd = await Bun.password.hash("MySuperStrongPassword@3545@");
// console.log(hasedPwd);

// then update ur db with the hash printed in console
