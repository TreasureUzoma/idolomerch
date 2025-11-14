import { z } from "zod";

export const productsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).default("newest"),
  category: z
    .enum(["hoodies", "shirts", "caps", "stickers", "posters", "accessories"])
    .optional(),
  currency: z
    .enum(["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "JPY", "CNY", "INR"])
    .default("USD"),
});

export type ProductsParams = z.infer<typeof productsQuerySchema>;

export const isValidUUID = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export const isValidSlug = z.object({
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/i,
      "Slug can only contain letters, numbers, hyphens, and underscores"
    ),
});

export const isValidEmail = z.object({
  email: z.string().email("Invalid email format"),
});

export const isValidCurrency = z.object({
  currency: z
    .enum(["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "JPY", "CNY", "IN"])
    .default("USD"),
});

export const createOrderSchema = z.object({
  currency: z
    .enum(["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "JPY", "CNY", "IN"])
    .default("USD"),
  products: z.array(
    z.object({
      slug: z.string(),
      quantity: z.number().min(1),
      price: z.number(),
    })
  ),
  shippingAddress: z.object({
    fullName: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    country: z.string(),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
  }),
  billingAddress: z
    .object({
      fullName: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string().optional(),
      country: z.string(),
      postalCode: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  userInfo: z
    .object({
      fullName: z.string(),
      email: z.string(),
      phoneNumber: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
  isGift: z.boolean().optional(),
  paymentMethod: z
    .enum(["card", "paypal", "bank_transfer", "btc", "usdt"])
    .default("card"),
});

export type OrderInputType = z.infer<typeof createOrderSchema>;
