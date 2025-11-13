import { Hono } from "hono";
import { serve } from "bun";
import { logger } from "hono/logger";

const app = new Hono();

const dummyProducts = [
  {
    id: 1,
    name: "Ceramic Minimalist Mug",
    price: 18.0,
    currency: "USD",
    imageUrl: "https://placehold.co/400x400/000000/FFFFFF?text=Mug",
    description:
      "A sleek, black ceramic mug perfect for your morning coffee. Dishwasher safe.",
    images: [
      "https://placehold.co/600x600/000000/FFFFFF?text=Mug+Angle+1",
      "https://placehold.co/600x600/000000/FFFFFF?text=Mug+Angle+2",
    ],
    instructions: "Wash before first use. Handle with care.",
  },
  {
    id: 2,
    name: "Vintage E-commerce Poster",
    price: 35.5,
    currency: "USD",
    imageUrl: "https://placehold.co/400x400/4F46E5/FFFFFF?text=Poster",
    description:
      "High-quality print poster celebrating retro web design and e-commerce.",
    images: [
      "https://placehold.co/600x600/4F46E5/FFFFFF?text=Poster+Detailed",
      "https://placehold.co/600x600/4F46E5/FFFFFF?text=Poster+Frame",
    ],
    instructions:
      "Frame not included. Handle print edges carefully to avoid creases.",
  },
  {
    id: 3,
    name: "Wireless Charging Pad",
    price: 49.99,
    currency: "USD",
    imageUrl: "https://placehold.co/400x400/9CA3AF/000000?text=Charger",
    description:
      "Fast wireless charging pad compatible with all major modern smartphones.",
    images: [
      "https://placehold.co/600x600/9CA3AF/000000?text=Charger+Top",
      "https://placehold.co/600x600/9CA3AF/000000?text=Charger+Side",
    ],
    instructions: "Plug into a high-wattage power adapter for fastest charge.",
  },
  {
    id: 4,
    name: "Developer Stickers Pack",
    price: 9.5,
    currency: "USD",
    imageUrl: "https://placehold.co/400x400/DC2626/FFFFFF?text=Stickers",
    description:
      "A fun pack of vinyl stickers featuring programming languages and framework logos.",
    images: ["https://placehold.co/600x600/DC2626/FFFFFF?text=Sticker+Sheet"],
    instructions: "Peel carefully. Apply to clean, dry surfaces only.",
  },
];

app.get("/", (c) => c.text("Hello from the server!"));

app.get("/products", (c) => {
  const page = parseInt(c.req.query("page") || "1", 10);
  const limit = parseInt(c.req.query("limit") || "10", 10);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = dummyProducts
    .slice(startIndex, endIndex)
    .map(({ id, name, price, currency, imageUrl }) => ({
      id,
      name,
      price,
      currency,
      imageUrl,
    }));

  return c.json({
    status: "success",
    page: page,
    limit: limit,
    total: dummyProducts.length,
    data: paginatedProducts,
  });
});

app.get("/products/:id", (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const product = dummyProducts.find((p) => p.id === id);

  if (!product) {
    return c.json(
      { status: "error", message: "Product not found", data: null },
      404
    );
  }

  return c.json({ status: "success", data: product });
});

app.use(logger());

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

const server = serve({
  port: 5000,
  fetch: app.fetch,
});

console.log(`Server is running on http://localhost:${server.port}`);
